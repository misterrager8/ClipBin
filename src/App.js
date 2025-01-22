import { createContext, useEffect, useState } from "react";
import "./App.css";
import Button from "./components/atoms/Button";
import ButtonGroup from "./components/molecules/ButtonGroup";
import Section from "./components/molecules/Section";
import ClipItem from "./components/atoms/ClipItem";
import Editor from "./components/molecules/Editor";

export const MultiContext = createContext();

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("clipbin-theme") || "light"
  );
  const [clips, setClips] = useState(
    JSON.parse(localStorage.getItem("clipbin-clips")) || []
  );
  const [selectedClip, setSelectedClip] = useState(null);
  const [hoveredClip, setHoveredClip] = useState(null);

  const addClip = () => {
    let clips_ = [...clips];
    let newDate_ = new Date();
    let id_ = `${newDate_.getFullYear()}${
      newDate_.getMonth() + 1
    }${newDate_.getDate()}${newDate_.getHours()}${newDate_.getMinutes()}${newDate_.getSeconds()}${newDate_.getMilliseconds()}`;

    let newClip = {
      id: id_,
      title: `Clip #${id_}`,
      content: "",
    };

    clips_.push(newClip);
    setSelectedClip(newClip);
    setClips(clips_);
  };

  const deleteClip = (id) => {
    let clips_ = clips.filter((x) => x.id !== id);
    setClips(clips_);

    id === selectedClip?.id && setSelectedClip(null);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("clipbin-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("clipbin-clips", JSON.stringify(clips));
  }, [clips]);

  const contextValue = {
    clips: clips,
    setClips: setClips,
    deleteClip: deleteClip,
    selectedClip: selectedClip,
    setSelectedClip: setSelectedClip,
    hoveredClip: hoveredClip,
    setHoveredClip: setHoveredClip,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      <div className="d-flex">
        <div className="w-25">
          <Section>
            <div className="between">
              <div>
                <Button
                  onClick={() => addClip()}
                  icon="plus-circle"
                  text="New Clip"
                  size="sm"
                />
              </div>
              <Button
                icon={theme === "light" ? "sun-fill" : "moon-fill"}
                size="sm"
                className="capped"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                text={theme}
              />
            </div>
            <hr />
            <div onMouseLeave={() => setHoveredClip(null)}>
              {clips.map((x) => (
                <ClipItem key={x.id} item={x} />
              ))}
            </div>
          </Section>
        </div>
        <div className="w-75">
          {selectedClip && (
            <Section>
              <Editor />
            </Section>
          )}
        </div>
      </div>
    </MultiContext.Provider>
  );
}

export default App;
