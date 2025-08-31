import React from 'react';

const GameOverScreen = ({ score, onRestart }) => {
  const isHighScore = score > 15852; // Original developer's best score
  
  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <div className="final-score">Final Score: {score.toLocaleString()}</div>
      
      {isHighScore && (
        <div style={{ 
          fontSize: '1.2em', 
          color: '#ffd700', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🎉 Congratulations! 🎉<br />
          You beat the developer's best score!<br />
          <span style={{ fontSize: '0.8em' }}>You're absolutely amazing! 😊</span>
        </div>
      )}
      
      <button className="game-button" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;