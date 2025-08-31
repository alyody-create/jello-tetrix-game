import React from 'react';

const ScorePanel = ({ score, level, lines }) => {
  return (
    <div className="panel-section">
      <h3>Score</h3>
      <div className="score-display">{score.toLocaleString()}</div>
      <div className="level-display">Level {level}</div>
      <div className="lines-display">Lines: {lines}</div>
    </div>
  );
};

export default ScorePanel;