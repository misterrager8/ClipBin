export default function ButtonGroup({ size, children, className = "" }) {
  return (
    <div
      className={"btn-group " + className + (size ? " btn-group-" + size : "")}>
      {children}
    </div>
  );
}
