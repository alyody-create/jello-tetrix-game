import React from 'react';

const ControlsPanel = () => {
  return (
    <div className="panel-section">
      <h3>Controls</h3>
      <ul className="controls-list">
        <li>
          <span>Move</span>
          <span className="key">← →</span>
        </li>
        <li>
          <span>Soft Drop</span>
          <span className="key">↓</span>
        </li>
        <li>
          <span>Rotate</span>
          <span className="key">↑</span>
        </li>
        <li>
          <span>Hard Drop</span>
          <span className="key">Space</span>
        </li>
        <li>
          <span>Restart</span>
          <span className="key">R</span>
        </li>
        <li>
          <span>Pause</span>
          <span className="key">P</span>
        </li>
      </ul>
    </div>
  );
};

export default ControlsPanel;