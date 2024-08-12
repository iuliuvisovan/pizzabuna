import "./index.css";

function VariableBox({ variable, value }) {
  return (
    <div className="variable-box">
      <span>{Number(value).toLocaleString()}</span>
      <hr style={{ width: "100%" }}></hr>
      <span>{variable}</span>
    </div>
  );
}

export default VariableBox;
