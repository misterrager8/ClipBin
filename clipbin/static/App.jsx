const defaultSettings = {
  theme: "light",
};

const MultiContext = React.createContext();

const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => (!data.success ? alert(data.msg) : callback(data)));

function Icon({ className, name }) {
  return <i className={className + " bi bi-" + name}></i>;
}

function Button({ className, type_, onClick, icon, text, size }) {
  return (
    <button
      type={type_}
      className={className + " btn" + (size === "sm" ? " btn-sm" : "")}
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </button>
  );
}

function Input({
  className,
  onChange,
  value,
  placeholder,
  required,
  type_,
  size,
}) {
  return (
    <input
      onChange={onChange}
      value={value}
      className={
        className + " form-control" + (size === "sm" ? " form-control-sm" : "")
      }
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      type={type_}
    />
  );
}

function ButtonGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " btn-group" + (size === "sm" ? " btn-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function InputGroup({ className, size, children }) {
  return (
    <div
      className={
        className + " input-group" + (size === "sm" ? " input-group-sm" : "")
      }>
      {children}
    </div>
  );
}

function Spinner({ className }) {
  return (
    <span className={className + " spinner-border spinner-border-sm"}></span>
  );
}

function Badge({ className, icon, text }) {
  return (
    <span className={className + " badge"}>
      {icon && <i className={"bi bi-" + icon + (text ? " me-1" : "")}></i>}
      {text}
    </span>
  );
}

function Dropdown({
  className,
  classNameBtn,
  classNameMenu,
  target,
  icon,
  children,
  text,
}) {
  return (
    <div className={className + " dropdown"}>
      <a
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        className={classNameBtn + " dropdown-toggle"}>
        {icon && <Icon name={icon} className="me-1" />}
        {text}
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </div>
  );
}

function Heading({ className, size = 1, icon, text }) {
  return (
    <div className={className + " text-center h" + size}>
      {icon && <Icon name={icon} className="me-3" />}
      {text}
    </div>
  );
}

function ClipItem({ item, className }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);

  return (
    <div
      className={
        className +
        " between p-1 m-1" +
        (multiCtx.currentClip.path === item.path ? " selected" : "")
      }>
      <a
        onClick={() => multiCtx.setCurrentClip(item)}
        className="fw-bold text-truncate">
        {item.name}
      </a>
      <ButtonGroup size="sm">
        {deleting && (
          <Button
            onClick={() => multiCtx.deleteClip(item.path)}
            className="border-0"
            icon="question-lg"
          />
        )}
        <Button
          className="border-0"
          icon="trash2"
          onClick={() => setDeleting(!deleting)}
        />
      </ButtonGroup>
    </div>
  );
}

function ClipEditor({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [deleting, setDeleting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");

  const onChangeName = (e) => setName(e.target.value);
  const onChangeContent = (e) => setContent(e.target.value);

  const [metadata, setMetadata] = React.useState("");
  const onChangeMetadata = (e) => setMetadata(e.target.value);

  React.useEffect(() => {
    if (multiCtx.currentClip.length !== 0) {
      setName(multiCtx.currentClip.name);
      setContent(multiCtx.currentClip.content);
      setMetadata(JSON.stringify(multiCtx.currentClip.metadata, undefined, 2));
      multiCtx.setFormatted("");
    }
  }, [multiCtx.currentClip]);

  return (
    <div className={className + " px-1 h-100"}>
      <InputGroup className="mb-2">
        <form
          className="input-group"
          onSubmit={(e) =>
            multiCtx.renameClip(e, multiCtx.currentClip.path, name)
          }>
          <Button
            type_="button"
            className="border-0"
            icon={saved ? "check-lg" : "floppy2"}
            onClick={() => {
              multiCtx.editClip(multiCtx.currentClip.path, content, metadata);
              setSaved(true);
              setTimeout(() => setSaved(false), 1500);
            }}
          />
          <Button
            type_="button"
            className="border-0"
            icon={"braces-asterisk"}
            onClick={() => {
              multiCtx.formatClip(multiCtx.currentClip.path);
            }}
          />
          <Button
            type_="button"
            onClick={() =>
              multiCtx.copyClip(
                multiCtx.formatted.length !== 0 ? multiCtx.formatted : content
              )
            }
            className="border-0"
            icon={"clipboard" + (multiCtx.copied ? "-check" : "")}
          />
          <Button
            type_="button"
            className="border-0"
            icon="trash2"
            onClick={() => setDeleting(!deleting)}
          />
          {deleting && (
            <Button
              type_="button"
              onClick={() => multiCtx.deleteClip(multiCtx.currentClip.path)}
              className="border-0"
              icon="question-lg"
            />
          )}
          <Input
            value={name}
            onChange={onChangeName}
            className="border-0 fw-bold"
          />
        </form>
      </InputGroup>
      <div className="row h-75">
        <div className="col" style={{ borderLeft: "1px dotted" }}>
          <textarea
            rows={10}
            value={content}
            onChange={onChangeContent}
            className="form-control form-control-sm h-100"></textarea>
        </div>
        <div className="col" style={{ borderRight: "1px dotted" }}>
          <textarea
            rows={10}
            value={metadata}
            onChange={onChangeMetadata}
            className="form-control form-control-sm h-100"></textarea>
        </div>
        <div className="col">
          {multiCtx.formatted ? (
            <div
              style={{
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                height: "100%",
                fontSize: "small",
              }}>
              {multiCtx.formatted}
            </div>
          ) : (
            <div className="d-flex h-100">
              <span className="m-auto small opacity-50">Formatted Text</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HomePage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  React.useEffect(() => {
    multiCtx.getClips();
  }, []);

  return (
    <div className="row h-100">
      <div className="col-2">
        <Nav className="mb-4" />
        {multiCtx.clips.map((x) => (
          <React.Fragment key={x.path}>
            <ClipItem item={x} />
          </React.Fragment>
        ))}
      </div>
      <div className="col-10">
        {multiCtx.currentClip.length !== 0 && <ClipEditor />}
      </div>
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " between"}>
      <div className="">
        <ButtonGroup size="sm">
          {multiCtx.loading && (
            <button className="btn border-0">
              <Spinner />
            </button>
          )}
          <Button
            onClick={() => multiCtx.addClip()}
            size="sm"
            text="New Clip"
            icon="plus-lg"
          />
        </ButtonGroup>
      </div>
      <ButtonGroup size="sm">
        <Button
          className="text-capitalize border-0"
          // text={multiCtx.settings.theme}
          icon={multiCtx.settings.theme === "light" ? "sun-fill" : "moon-fill"}
          onClick={() =>
            multiCtx.setSettings({
              ...multiCtx.settings,
              theme: multiCtx.settings.theme === "light" ? "dark" : "light",
            })
          }
        />
      </ButtonGroup>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [settings, setSettings] = React.useState(
    JSON.parse(localStorage.getItem("clipbin")) || defaultSettings
  );

  const [clips, setClips] = React.useState([]);
  const [currentClip, setCurrentClip] = React.useState([]);

  const [formatted, setFormatted] = React.useState([]);

  const addClip = () => {
    api("add_clip", {}, (data) => {
      getClips();
      setCurrentClip(data.clip);
    });
  };

  const getClips = () => {
    setLoading(true);
    api("clips", {}, (data) => {
      setClips(data.clips);
      setLoading(false);
    });
  };

  const editClip = (path, content, metadata) => {
    setLoading(true);
    api(
      "edit_clip",
      { path: path, content: content, metadata: metadata },
      (data) => setLoading(false)
    );
  };

  const renameClip = (e, path, newName) => {
    e.preventDefault();
    setLoading(true);
    api("rename_clip", { path: path, new_name: newName }, (data) => {
      getClips();
      setCurrentClip(data.clip);
      setLoading(false);
    });
  };

  const deleteClip = (path) => {
    setLoading(true);
    api("delete_clip", { path: path }, (data) => {
      path === currentClip.path && setCurrentClip([]);
      getClips();
    });
  };

  const copyClip = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatClip = (path) => {
    api("format_clip", { path: path }, (data) => setFormatted(data.formatted));
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoading,
    settings: settings,
    setSettings: setSettings,
    currentPage: currentPage,
    setCurrentPage: setCurrentPage,
    clips: clips,
    setClips: setClips,
    addClip: addClip,
    getClips: getClips,
    currentClip: currentClip,
    setCurrentClip: setCurrentClip,
    editClip: editClip,
    deleteClip: deleteClip,
    copyClip: copyClip,
    copied: copied,
    setCopied: setCopied,
    formatClip: formatClip,
    formatted: formatted,
    setFormatted: setFormatted,
    renameClip: renameClip,
  };

  React.useEffect(() => {
    localStorage.setItem("clipbin", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="p-5 vh-100">
        {/* <Nav className="mb-5" /> */}
        <HomePage />
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
