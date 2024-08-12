import './index.css';

function VariableBox({ variable, value, bold, green, blue }) {
  return (
    <div className={'variable-box' + (bold ? ' bold' : '') + (green ? ' green' : '') + (blue ? ' blue' : '')}>
      <span className="value">{typeof value === 'number' ? value.toLocaleString() : value}</span>
      <span className="name">{variable}</span>
    </div>
  );
}

export default VariableBox;
