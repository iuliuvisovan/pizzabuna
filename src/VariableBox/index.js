import './index.css';

function VariableBox({ variable, value, bold, green, blue, gray, gold, unit }) {
  return (
    <div
      className={
        'variable-box' +
        (bold ? ' bold' : '') +
        (green ? ' green' : '') +
        (blue ? ' blue' : '') +
        (gray ? ' gray' : '') +
        (gold ? ' gold' : '')
      }
    >
      <span className="value">{typeof value === 'number' ? value.toLocaleString('ro-RO') + ' ' + (unit || 'RON') : value}</span>
      <span className="name">{variable}</span>
    </div>
  );
}

export default VariableBox;
