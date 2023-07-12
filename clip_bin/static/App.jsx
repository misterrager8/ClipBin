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

function ClipItem({ item }) {
  const [, , getClips] = React.useContext(ClipsContext);
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);
  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const getClip = () => {
    makeAPICall("/clip", { name: item.name }, function (data) {
      setCurrentClip(data);
    });
  };

  const toggleFavorite = () => {
    makeAPICall("/toggle_favorite", { name: item.name }, function (data) {
      getClips();
    });
  };

  const deleteClip = () => {
    makeAPICall("/delete_clip", { name: item.name }, function (data) {
      item.name === currentClip.name && setCurrentClip([]);
      getClips();
    });
  };

  const copyClip = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="input-group">
        <span
          className={
            "input-group-text" +
            (currentClip.stem === item.stem ? "" : " invisible")
          }>
          <i className="bi bi-circle-fill"></i>
        </span>
        <a onClick={() => copyClip()} className="btn px-2 border-0">
          <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
        </a>
        <a onClick={() => getClip()} className="input-group-text">
          {item.stem}
        </a>
      </div>
      <div className="btn-group">
        <a onClick={() => toggleFavorite()} className="btn px-2 border-0">
          <i className={"bi bi-star" + (item.favorited ? "-fill" : "")}></i>
        </a>
        {deleting && (
          <a onClick={() => deleteClip()} className="btn px-2 border-0">
            <i className="bi bi-question-lg"></i>
          </a>
        )}
        <a onClick={() => setDeleting(true)} className="btn px-2 border-0">
          <i className="bi bi-x-lg"></i>
        </a>
      </div>
    </div>
  );
}

function Editor() {
  const [, , getClips] = React.useContext(ClipsContext);
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);
  const [saved, setSaved] = React.useState(false);

  const renameClip = (e) => {
    e.preventDefault();
    makeAPICall(
      "/rename_clip",
      {
        name: currentClip.name,
        new_name: document.getElementById("clip-name").value,
      },
      function (data) {
        setCurrentClip(data);
        getClips();
      }
    );
  };

  const editClip = () => {
    makeAPICall(
      "/edit_clip",
      {
        name: currentClip.name,
        content: document.getElementById("content").value,
      },
      function (data) {
        setCurrentClip(data);
        setSaved(true);
        setTimeout(function () {
          setSaved(false);
        }, 1500);
      }
    );
  };

  return (
    <>
      {currentClip.length !== 0 && (
        <>
          <form
            className="input-group input-group-lg mb-2"
            onSubmit={(e) => renameClip(e)}>
            <a onClick={() => editClip()} className="btn border-0">
              <i className={"bi bi-" + (saved ? "check-lg" : "save2-fill")}></i>
            </a>
            <input
              id="clip-name"
              autoComplete="off"
              className="form-control border-0 font"
              defaultValue={currentClip.stem}
              key={`${currentClip.stem}-name`}
            />
          </form>
          <hr />
          <div style={{ height: "500px" }}>
            <textarea
              id="content"
              defaultValue={currentClip.content}
              key={`${currentClip.stem}-content`}
              className="form-control h-100 border-0"></textarea>
          </div>
        </>
      )}
    </>
  );
}

function Nav() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("ClipBin") || "light"
  );

  React.useEffect(() => {
    localStorage.setItem("ClipBin", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themes = ["light", "dark", "daft", "unknown"];

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="btn-group">
          <a className="btn border-0">ClipBin</a>
        </div>
        <div className="btn-group">
          <div className="btn-group dropdown">
            <a
              data-bs-toggle="dropdown"
              data-bs-target="#themes"
              className="btn dropdown-toggle text-capitalize">
              <i className="me-2 bi bi-paint-bucket"></i>
              {theme}
            </a>
            <div id="themes" className="dropdown-menu">
              {themes.map((x) => (
                <>
                  {theme !== x && (
                    <a
                      key={x}
                      onClick={() => setTheme(x)}
                      className="dropdown-item text-capitalize">
                      {x}
                    </a>
                  )}
                </>
              ))}
            </div>
          </div>
          <a className="btn">
            <i className="me-2 bi bi-gear"></i>Settings
          </a>
          <a
            className="btn"
            target="_blank"
            href="https://github.com/misterrager8/ClipBin">
            <i className="me-2 bi bi-info-circle"></i>About
          </a>
        </div>
      </div>
    </>
  );
}

function ClipList() {
  const [clips, , getClips] = React.useContext(ClipsContext);
  const [, setCurrentClip] = React.useContext(CurrentClipContext);

  React.useEffect(() => {
    getClips();
  }, []);

  const createClip = () => {
    makeAPICall("/create_clip", {}, function (data) {
      setCurrentClip(data);
      getClips();
    });
  };

  return (
    <>
      <a onClick={() => createClip()} className="btn w-100">
        <i className="me-2 bi bi-plus-circle"></i>New Clip
      </a>
      <hr />
      <div className="mt-2" style={{ height: "300px", overflowY: "auto" }}>
        {clips.map((x) => (
          <ClipItem item={x} key={`${x.name}-card`} />
        ))}
      </div>
    </>
  );
}

function Home() {
  return (
    <div className="p-5">
      <Nav />
      <hr />
      <div className="row mt-2">
        <div className="col-3">
          <ClipList />
        </div>
        <div className="col-9">
          <Editor />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentClip, setCurrentClip] = React.useState([]);
  const [clips, setClips] = React.useState([]);

  const getClips = () => {
    makeAPICall("/clips", {}, function (data) {
      setClips(data.clips);
    });
  };

  return (
    <>
      <ClipsContext.Provider value={[clips, setClips, getClips]}>
        <CurrentClipContext.Provider value={[currentClip, setCurrentClip]}>
          <Home />
        </CurrentClipContext.Provider>
      </ClipsContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
