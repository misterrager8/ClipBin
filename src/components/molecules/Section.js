export default function Section({ children, className = "" }) {
  return (
    <div className={"outer " + className}>
      <div className="inner">{children}</div>
    </div>
  );
}
