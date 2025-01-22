export default function Button({
  text,
  type_ = "button",
  icon,
  size,
  onClick,
  border = true,
  className = "",
}) {
  return (
    <button
      type={type_}
      className={
        "btn " +
        className +
        (size ? " btn-" + size : "") +
        (border ? "" : " border-0")
      }
      onClick={onClick}>
      {icon && <i className={(text ? "me-2 " : "") + "bi bi-" + icon}></i>}
      {text}
    </button>
  );
}
