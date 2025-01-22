export default function InputGroup({ size, children, className = "" }) {
  return (
    <div
      className={
        "input-group " + className + (size ? " input-group-" + size : "")
      }>
      {children}
    </div>
  );
}
