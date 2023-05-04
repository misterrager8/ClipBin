const ClipsContext = React.createContext();
const CurrentClipContext = React.createContext();

function ClipItem({ item }) {
  const [clips, setClips] = React.useContext(ClipsContext);
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);
  const [deleting, setDeleting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const getClip = () => {
    $.get(
      "/clip",
      {
        name: item.name,
      },
      function (data) {
        setCurrentClip(data);
      }
    );
  };

  const toggleFavorite = () => {
    $.get(
      "/toggle_favorite",
      {
        name: item.name,
      },
      function (data) {
        $.get("/clips", function (data_) {
          setClips(data_.clips);
        });
      }
    );
  };

  const deleteClip = () => {
    $.get(
      "/delete_clip",
      {
        name: item.name,
      },
      function (data) {
        $.get("/clips", function (data_) {
          setClips(data_.clips);
        });
      }
    );
  };

  const copyClip = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className={
        "clip-item " + (item.name === currentClip.name ? " selected" : "")
      }
    >
      <div className="d-flex justify-content-between">
        <div className="text-truncate">
          <a onClick={() => copyClip()}>
            <i className={"bi bi-clipboard" + (copied ? "-check" : "")}></i>
          </a>
          <a onClick={() => toggleFavorite()} className="text-warning mx-2">
            <i className={"bi bi-star" + (item.favorited ? "-fill" : "")}></i>
          </a>
          <a onClick={() => getClip()}>{item.stem}</a>
        </div>
        <div className="">
          <span className="">
            {deleting && (
              <a onClick={() => deleteClip()} className="text-danger mx-2">
                <i className="bi bi-question-lg"></i>
              </a>
            )}
            <a onClick={() => setDeleting(!deleting)} className="text-danger">
              <i className="bi bi-x-circle"></i>
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

function Editor() {
  const [clips, setClips] = React.useContext(ClipsContext);
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);
  const [saved, setSaved] = React.useState(false);

  const renameClip = (e) => {
    e.preventDefault();
    $.post(
      "/rename_clip",
      {
        name: currentClip.name,
        new_name: $("#clip-name").val(),
      },
      function (data) {
        setCurrentClip(data);
        $.get("/clips", function (data_) {
          setClips(data_.clips);
        });
      }
    );
  };

  const editClip = () => {
    $.post(
      "/edit_clip",
      {
        name: currentClip.name,
        content: $("#content").val(),
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
            onSubmit={(e) => renameClip(e)}
          >
            <a onClick={() => editClip()} className="btn text-success ps-0">
              <i className={"bi bi-" + (saved ? "check-lg" : "save2-fill")}></i>
            </a>
            <input
              id="clip-name"
              autoComplete="off"
              className="form-control p-0 border-0"
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
              className="form-control h-100 border-0"
            ></textarea>
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

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="btn-group btn-group-sm">
          <a className="btn text-secondary">
            <i className="me-2 bi bi-circle"></i>ClipBin
          </a>
        </div>
        <div className="btn-group btn-group-sm">
          <a
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="btn text-secondary text-capitalize"
          >
            <i
              className={
                "me-2 bi bi-" + (theme === "light" ? "sun-fill" : "moon-fill")
              }
            ></i>
            {theme}
          </a>
          <a className="btn text-secondary">
            <i className="me-2 bi bi-gear"></i>Settings
          </a>
          <a className="btn text-secondary">
            <i className="me-2 bi bi-info-circle"></i>About
          </a>
        </div>
      </div>
    </>
  );
}

function ClipList() {
  const [clips, setClips] = React.useContext(ClipsContext);
  const [currentClip, setCurrentClip] = React.useContext(CurrentClipContext);

  React.useEffect(() => {
    $.get("/clips", function (data) {
      setClips(data.clips);
    });
  }, []);

  const createClip = () => {
    $.get("/create_clip", function (data) {
      setCurrentClip(data);
      $.get("/clips", function (data_) {
        setClips(data_.clips);
      });
    });
  };

  return (
    <>
      <a
        onClick={() => createClip()}
        className="btn btn-sm btn-outline-success w-100"
      >
        <i className="me-2 bi bi-plus-circle"></i>New Clip
      </a>
      <hr />
      <div className="mt-2">
        {clips.map((x) => (
          <ClipItem item={x} key={`${x.name}-card`} />
        ))}
      </div>
    </>
  );
}

function Home() {
  return (
    <div className="m-5 p-5">
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

  return (
    <>
      <ClipsContext.Provider value={[clips, setClips]}>
        <CurrentClipContext.Provider value={[currentClip, setCurrentClip]}>
          <Home />
        </CurrentClipContext.Provider>
      </ClipsContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
