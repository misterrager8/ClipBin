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
    .then((data) => (!data.success ? alert("Error") : callback(data)));

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
        " between hover px-3 py-1 my-1 rounded" +
        (multiCtx.currentClip.path === item.path ? " selected" : "")
      }>
      <a
        onClick={() => multiCtx.setCurrentClip(item)}
        className="text-truncate">
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

  React.useEffect(() => {
    if (multiCtx.currentClip.length !== 0) {
      setName(multiCtx.currentClip.name);
      setContent(multiCtx.currentClip.content);
    }
  }, [multiCtx.currentClip]);

  return (
    <div className={className + " px-1"}>
      <InputGroup size="sm" className="mb-3">
        <Button
          className="border-0"
          icon={saved ? "check-lg" : "floppy2"}
          onClick={() => {
            multiCtx.editClip(multiCtx.currentClip.path, content);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
        />
        <Button
          onClick={() => multiCtx.copyClip(content)}
          className="border-0"
          icon={"clipboard" + (multiCtx.copied ? "-check" : "")}
        />
        <Button
          className="border-0"
          icon="trash2"
          onClick={() => setDeleting(!deleting)}
        />
        {deleting && (
          <Button
            onClick={() => multiCtx.deleteClip(multiCtx.currentClip.path)}
            className="border-0"
            icon="question-lg"
          />
        )}
        <Input
          value={name}
          onChange={onChangeName}
          className="border-0 fst-italic"
        />
      </InputGroup>
      <hr />
      <textarea
        value={content}
        onChange={onChangeContent}
        className="form-control form-control-sm h-100 border-0"></textarea>
    </div>
  );
}

function HomePage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  React.useEffect(() => {
    multiCtx.getClips();
  }, []);

  return (
    <div className={className}>
      <div className="row h-100">
        <div className="col-2">
          <Button
            className="w-100"
            text="New Clip"
            icon="plus-lg"
            size="sm"
            onClick={() => multiCtx.addClip()}
          />
          <hr />
          {multiCtx.clips.map((x) => (
            <React.Fragment key={x.path}>
              <ClipItem item={x} />
            </React.Fragment>
          ))}
        </div>
        <div className="col-10 border-start">
          {multiCtx.currentClip.length !== 0 && <ClipEditor />}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className}>
      <Heading icon="gear" text="Settings" className="mb-4" />
      <div style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(multiCtx.settings, null, 4)}
      </div>
    </div>
  );
}

function AboutPage({ className }) {
  const multiCtx = React.useContext(MultiContext);
  const [readme, setReadme] = React.useState("");

  React.useEffect(() => {
    multiCtx.setLoading(true);
    api("about", {}, (data) => {
      setReadme(data.readme);
      multiCtx.setLoading(false);
    });
  }, []);

  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{
          __html: window.markdownit().render(readme),
        }}></div>
    </div>
  );
}

function Display({ className }) {
  const multiCtx = React.useContext(MultiContext);

  return (
    <div className={className + " p-4"}>
      {multiCtx.currentPage === "settings" ? (
        <SettingsPage />
      ) : multiCtx.currentPage === "about" ? (
        <AboutPage />
      ) : (
        <HomePage />
      )}
    </div>
  );
}

function Nav({ className }) {
  const multiCtx = React.useContext(MultiContext);

  const themes = [
    "light",
    "dark",
    "caramel",
    "ocean",
    "violet",
    "navy",
    "vanilla",
    "mint",
    "ruby",
    "forest",
  ];

  return (
    <div className={className + " between"}>
      <ButtonGroup size="sm">
        {multiCtx.loading && (
          <button className="btn border-0">
            <Spinner />
          </button>
        )}
        <Button
          onClick={() => multiCtx.setCurrentPage("")}
          className="border-0"
          text="clipbin"
          icon="clipboard-heart"
        />
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Dropdown
          className="btn-group btn-group-sm"
          icon="paint-bucket"
          text={multiCtx.settings.theme}
          classNameMenu="text-center"
          classNameBtn="btn text-capitalize">
          {themes.map((x) => (
            <React.Fragment key={x}>
              {multiCtx.settings.theme !== x && (
                <button
                  className="dropdown-item text-capitalize small"
                  onClick={() =>
                    multiCtx.setSettings({ ...multiCtx.settings, theme: x })
                  }>
                  {x}
                </button>
              )}
            </React.Fragment>
          ))}
        </Dropdown>
        <Button
          text="Settings"
          icon="gear"
          className={multiCtx.currentPage === "settings" ? " active" : ""}
          onClick={() => multiCtx.setCurrentPage("settings")}
        />
        <Button
          className={multiCtx.currentPage === "about" ? " active" : ""}
          text="About"
          icon="info-circle"
          onClick={() => multiCtx.setCurrentPage("about")}
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

  const editClip = (path, content) => {
    setLoading(true);
    api("edit_clip", { path: path, content: content }, (data) =>
      setLoading(false)
    );
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
  };

  React.useEffect(() => {
    localStorage.setItem("clipbin", JSON.stringify(settings));

    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="p-4" style={{ height: "500px" }}>
        <Nav />
        <hr />
        <Display />
      </div>
    </MultiContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
