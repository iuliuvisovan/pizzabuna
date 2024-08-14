import './index.css';

function VariableBox({ variable, value, bold, green, blue, gray }) {
  return (
    <div className={'variable-box' + (bold ? ' bold' : '') + (green ? ' green' : '') + (blue ? ' blue' : '') + (gray ? ' gray' : '')}>
      <span className="value">{typeof value === 'number' ? value.toLocaleString('ro-RO') : value}</span>
      <span className="name">{variable}</span>
    </div>
  );
}

export default VariableBox;
