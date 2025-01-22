export default function Input({
  value,
  onChange,
  size,
  type_ = "text",
  placeholder,
  className = "",
}) {
  return (
    <input
      placeholder={placeholder}
      autoComplete="off"
      value={value}
      onChange={onChange}
      type={type_}
      className={
        "form-control " + className + (size ? " form-control-" + size : "")
      }
    />
  );
}
