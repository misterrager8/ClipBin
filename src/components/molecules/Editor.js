import { useContext, useEffect, useState } from "react";
import { MultiContext } from "../../App";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import InputGroup from "./InputGroup";

export default function Editor({ className = "" }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const onChangeTitle = (e) => setTitle(e.target.value);
  const onChangeContent = (e) => setContent(e.target.value);

  const multiCtx = useContext(MultiContext);

  useEffect(() => {
    if (multiCtx.selectedClip) {
      setTitle(multiCtx.selectedClip?.title);
      setContent(multiCtx.selectedClip?.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [multiCtx.selectedClip]);

  const copyClip = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const editClip = (e) => {
    e.preventDefault();
    let clips_ = [...multiCtx.clips];
    let clip_ = clips_[clips_.indexOf(multiCtx.selectedClip)];

    clip_.content = content;
    clip_.title = title;

    multiCtx.setClips(clips_);
    // multiCtx.setSelectedClip(clip_);

    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  const toggleFavorite = () => {
    let clips_ = [...multiCtx.clips];
    let clip_ = clips_[clips_.indexOf(multiCtx.selectedClip)];

    clip_.pinned = !clip_.pinned;

    multiCtx.setClips(clips_);
  };

  return (
    <form className={className} onSubmit={(e) => editClip(e)}>
      <InputGroup className="mb-3">
        <Button
          border={false}
          type_="submit"
          icon={saved ? "check-lg" : "floppy2-fill"}
        />
        <Button
          border={false}
          onClick={() => copyClip()}
          icon={"clipboard" + (copied ? "-check" : "")}
        />
        <Button
          border={false}
          onClick={() => toggleFavorite()}
          icon={"pin-angle" + (multiCtx.selectedClip.pinned ? "-fill" : "")}
        />
        <Input
          className="border-0 label fst-italic"
          onChange={onChangeTitle}
          value={title}
        />
      </InputGroup>
      <textarea
        placeholder="..."
        value={content}
        onChange={onChangeContent}
        rows={25}
        className="form-control"
      />
    </form>
  );
}
