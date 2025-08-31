import React from 'react';
import { useGameLogic } from './useGameLogic';
import GameBoard from './GameBoard';
import NextPiecePreview from './NextPiecePreview';
import ScorePanel from './ScorePanel';
import ControlsPanel from './ControlsPanel';
import SettingsPanel from './SettingsPanel';
import GameOverScreen from './GameOverScreen';
import './App.css';

function App() {
  const {
    board,
    nextPiece,
    score,
    level,
    lines,
    gameState,
    settings,
    clearedLines,
    particles,
    initGame,
    togglePause,
    restartGame,
    updateSettings,
    movePiece,
    rotatePieceAction,
    hardDrop
  } = useGameLogic();

  return (
    <div className="game-container">
      {/* Main Game Area */}
      <div className="game-board-container">
        <h1 style={{ 
          fontSize: '2.5em', 
          marginBottom: '20px', 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #ffd700, #ffb347)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
        }}>
          Jello Tetrix
        </h1>
        
        <div style={{ position: 'relative' }}>
          <GameBoard 
            board={board} 
            clearedLines={clearedLines}
            particles={particles}
          />
          
          {/* Game Over Overlay */}
          {gameState === 'gameOver' && (
            <GameOverScreen score={score} onRestart={restartGame} />
          )}
          
          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <div className="game-over" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
              <h2>Paused</h2>
              <button className="game-button pause-button" onClick={togglePause}>
                Resume
              </button>
            </div>
          )}
          
          {/* Start Screen */}
          {gameState === 'idle' && (
            <div className="game-over" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
              <h2>Welcome to Jello Tetrix!</h2>
              <p style={{ marginBottom: '30px', textAlign: 'center', fontSize: '1.1em' }}>
                A modern Tetris with jello physics effects
              </p>
              <button className="game-button" onClick={initGame}>
                Start Game
              </button>
            </div>
          )}
        </div>
        
        {/* Game Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '20px',
          justifyContent: 'center'
        }}>
          {gameState === 'idle' && (
            <button className="game-button" onClick={initGame}>
              Start Game
            </button>
          )}
          {gameState === 'playing' && (
            <button className="game-button pause-button" onClick={togglePause}>
              Pause
            </button>
          )}
          {gameState === 'paused' && (
            <button className="game-button pause-button" onClick={togglePause}>
              Resume
            </button>
          )}
          {(gameState === 'playing' || gameState === 'paused' || gameState === 'gameOver') && (
            <button className="game-button" onClick={restartGame}>
              Restart
            </button>
          )}
        </div>
        
        {/* Mobile Controls */}
        <div className="mobile-controls">
          <button 
            className="mobile-control-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                movePiece(-1, 0);
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                movePiece(-1, 0);
              }
            }}
          >
            ←
          </button>
          <button 
            className="mobile-control-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                rotatePieceAction();
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                rotatePieceAction();
              }
            }}
          >
            ↻
          </button>
          <button 
            className="mobile-control-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                movePiece(1, 0);
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                movePiece(1, 0);
              }
            }}
          >
            →
          </button>
          <button 
            className="mobile-control-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                hardDrop();
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              if (gameState === 'playing') {
                hardDrop();
              }
            }}
          >
            ↓
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="side-panel">
        {/* Score Panel */}
        <ScorePanel score={score} level={level} lines={lines} />
        
        {/* Next Piece */}
        <div className="panel-section">
          <h3>Next Piece</h3>
          <NextPiecePreview nextPiece={nextPiece} />
        </div>
        
        {/* Controls */}
        <ControlsPanel />
        
        {/* Settings */}
        <SettingsPanel settings={settings} updateSettings={updateSettings} />
        
        {/* Game Info */}
        <div className="panel-section">
          <h3>About</h3>
          <p style={{ fontSize: '0.9em', lineHeight: '1.4', color: '#ccc' }}>
            Jello Tetrix is a modern take on the classic Tetris game with physics-based effects.
            Clear lines by filling rows completely. More lines cleared at once give higher scores!
          </p>
          <div style={{ marginTop: '15px', fontSize: '0.8em', color: '#999' }}>
            <p>Made with ❤️ for free play</p>
            <p>Beat 15,852 points for a surprise! 🎉</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;