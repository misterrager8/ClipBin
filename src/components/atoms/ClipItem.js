import { useContext, useState } from "react";
import ButtonGroup from "../molecules/ButtonGroup";
import Button from "./Button";
import { MultiContext } from "../../App";

export default function ClipItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      className={
        "clip-item between" +
        (multiCtx.hoveredClip?.id === item.id ? " hovered" : "") +
        (multiCtx.selectedClip?.id === item.id ? " selected" : "")
      }
      onMouseEnter={() => multiCtx.setHoveredClip(item)}>
      <div
        onClick={() =>
          multiCtx.setSelectedClip(
            multiCtx.selectedClip?.id === item.id ? null : item
          )
        }
        className="label text-truncate py-1">
        {item.title}
      </div>
      <ButtonGroup size="sm">
        <Button
          border={false}
          icon={"pin-angle" + (item.pinned ? "-fill" : "")}
        />
        {deleting && (
          <Button
            border={false}
            className="text-danger"
            onClick={() => {
              multiCtx.deleteClip(item.id);
            }}
            icon="question-lg"
          />
        )}
        <Button
          border={false}
          className="text-danger"
          onClick={() => setDeleting(!deleting)}
          icon="trash2"
        />
      </ButtonGroup>
    </div>
  );
}
