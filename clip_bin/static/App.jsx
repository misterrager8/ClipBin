const ClipsContext = React.createContext();
const CurrentClipContext = React.createContext();

const makeAPICall = (url, params, callback) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));
};

const copyClip = (content, callback) => {
  navigator.clipboard.writeText(content);
  callback();
};

const deleteClip = (path, callback) => {
  makeAPICall("/delete", { path: path }, (data) => callback(data));
};

const toggleFavorite = (path, callback) => {
  makeAPICall("/toggle_favorite", { path: path }, (data) => callback(data));
};

function Search() {
  const [query, setQuery] = React.useState("");

  const onChangeQuery = (e) => setQuery(e.target.value);

  return (
    <form>
      <input
        defaultValue={query}
        onChange={onChangeQuery}
        className="form-control"
        placeholder="Search"
      />
    </form>
  );
}

function Nav() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("ClipBin") || "light"
  );
  const [clips, setClips, getClips] = React.useContext(ClipsContext);
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);

  const addClip = () => {
    makeAPICall("/add", {}, (data) => {
      setCurrentClip(data);
      getClips();
    });
  };

  React.useEffect(() => {
    localStorage.setItem("ClipBin", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="mb-3">
      <button
        className="btn text-capitalize w-100 mb-2"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <i
          className={
            "me-2 bi bi-" + (theme === "light" ? "sun-fill" : "moon-fill")
          }></i>
        {theme}
      </button>
      <button className="btn w-100 mb-1" onClick={() => addClip()}>
        <i className="me-2 bi bi-plus-lg"></i>New
      </button>
      <hr />
      <Search />
    </div>
  );
}

function ClipPage() {
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);
  const [clips, setClips, getClips] = React.useContext(ClipsContext);
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [mode, setMode] = React.useState("view");
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeContent = (e) => setContent(e.target.value);

  React.useEffect(() => {
    // setMode("view");
    setContent(currentClip.content);
    setName(currentClip.name);
  }, [currentClip]);

  const edit = () => {
    makeAPICall(
      "/edit",
      { path: currentClip.path, content: content },
      (data) => {
        setCurrentClip(data);
        getClips();
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    );
  };

  const rename = (e) => {
    e.preventDefault();
    makeAPICall(
      "/rename",
      { path: currentClip.path, new_name: name },
      (data) => {
        setCurrentClip(data);
        getClips();
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    );
  };

  return (
    <div className="col-9" style={{ height: "695px" }}>
      <form onSubmit={(e) => rename(e)}>
        <input
          className="form-control border-0 mb-2 text-center font-custom"
          style={{ fontSize: "2rem" }}
          defaultValue={name}
          onChange={onChangeName}
          required
        />
      </form>
      <div className="d-flex mb-2">
        <div className="btn-group mx-auto">
          <button
            onClick={() => setMode(mode === "view" ? "edit" : "view")}
            type="button"
            className="btn border-0">
            <i className={"bi bi-" + (mode === "view" ? "pen" : "eye")}></i>
          </button>
          {mode === "edit" && (
            <button
              onClick={() => edit()}
              type="button"
              className="btn border-0">
              <i
                className={
                  "text-success bi bi-check" + (saved ? "-lg" : "-circle")
                }></i>
            </button>
          )}
          <button
            type="button"
            className="btn border-0"
            onClick={() =>
              toggleFavorite(currentClip.path, (data) => {
                setCurrentClip(data);
                getClips();
              })
            }>
            <i
              className={
                "text-warning bi bi-star" +
                (currentClip.favorited ? "-fill" : "")
              }></i>
          </button>
          <button
            onClick={() =>
              copyClip(currentClip.content, () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              })
            }
            type="button"
            className="btn border-0">
            <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
          </button>
          {deleting && (
            <button
              type="button"
              className="btn border-0"
              onClick={() =>
                deleteClip(currentClip.path, () => {
                  setCurrentClip([]);
                  getClips();
                })
              }>
              <i className="text-danger bi bi-question-lg"></i>
            </button>
          )}
          <button
            onClick={() => setDeleting(!deleting)}
            type="button"
            className="btn border-0">
            <i className="text-danger bi bi-trash2"></i>
          </button>
        </div>
      </div>
      {mode === "edit" ? (
        <textarea
          onChange={onChangeContent}
          className="form-control h-100 border-0 fst-italic"
          defaultValue={content}></textarea>
      ) : (
        <div
          className="h-100 small p-1"
          style={{ whiteSpace: "pre-wrap", overflowY: "auto" }}>
          {content}
        </div>
      )}
    </div>
  );
}

function ClipItem({ item }) {
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);
  const [clips, setClips, getClips] = React.useContext(ClipsContext);
  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  return (
    <div
      className={
        "clip-item d-flex justify-content-between" +
        (currentClip.name === item.name ? " selected" : "")
      }>
      <a className="py-2 font-custom" onClick={() => setCurrentClip(item)}>
        {item.name}
      </a>
      <div className="btn-group">
        <button
          onClick={() =>
            toggleFavorite(item.path, (data) => {
              if (item.name === currentClip.name) {
                setCurrentClip(data);
              }
              getClips();
            })
          }
          className="btn px-2 border-0">
          <i
            className={
              "text-warning bi bi-star" + (item.favorited ? "-fill" : "")
            }></i>
        </button>
        <button
          className="btn px-2 border-0"
          onClick={() =>
            copyClip(item.content, () => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
          }>
          <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
        </button>
        {deleting && (
          <button
            onClick={() => deleteClip(item.path, () => getClips())}
            className="btn px-2 border-0">
            <i className="text-danger bi bi-question-lg"></i>
          </button>
        )}
        <button
          className="btn px-2 border-0"
          onClick={() => setDeleting(!deleting)}>
          <i className="text-danger bi bi-trash2"></i>
        </button>
      </div>
    </div>
  );
}

function ClipList() {
  const [clips, setClips] = React.useContext(ClipsContext);

  return (
    <div className="pe-3" style={{ height: "630px", overflowY: "auto" }}>
      {clips.map((x) => (
        <ClipItem item={x} key={x.name} />
      ))}
    </div>
  );
}

function App() {
  const [clips, setClips] = React.useState([]);
  const [currentClip, setCurrentClip] = React.useState([]);

  const getClips = () => {
    makeAPICall("/clips", {}, (data) => setClips(data.clips));
  };

  React.useEffect(() => {
    getClips();
  }, []);

  return (
    <div className="p-5">
      <ClipsContext.Provider value={[clips, setClips, getClips]}>
        <CurrentClipContext.Provider value={[currentClip, setCurrentClip]}>
          <div className="row">
            <div className="col-3">
              <Nav />
              <ClipList />
            </div>
            {currentClip.length !== 0 && <ClipPage />}
          </div>
        </CurrentClipContext.Provider>
      </ClipsContext.Provider>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
