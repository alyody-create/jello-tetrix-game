import React from 'react';
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } from './gameLogic';

const GameBoard = ({ board, clearedLines, particles }) => {
  return (
    <div className="game-board">
      <div className="game-grid">
        {/* Render board blocks */}
        {board.map((row, y) =>
          row.map((cell, x) => {
            const isClearedLine = clearedLines.includes(y);
            return (
              <div
                key={`${x}-${y}`}
                className={`tetris-block ${cell ? cell : ''} ${isClearedLine ? 'clearing' : ''}`}
                style={{
                  left: x * BLOCK_SIZE + 'px',
                  top: y * BLOCK_SIZE + 'px',
                  width: BLOCK_SIZE + 'px',
                  height: BLOCK_SIZE + 'px',
                  opacity: cell ? 1 : 0,
                  transform: isClearedLine ? 'scale(1.1)' : 'scale(1)',
                  filter: isClearedLine ? 'brightness(1.5)' : 'brightness(1)',
                  transition: isClearedLine ? 'all 0.3s ease' : 'none'
                }}
              />
            );
          })
        )}
        
        {/* Render particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.x + 'px',
              top: particle.y + 'px',
              backgroundColor: particle.color,
              width: particle.size + 'px',
              height: particle.size + 'px',
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              opacity: particle.life
            }}
          />
        ))}
        
        {/* Grid lines (optional, for better visibility) */}
        <div className="grid-overlay">
          {Array.from({ length: BOARD_HEIGHT + 1 }).map((_, y) => (
            <div
              key={`h-${y}`}
              style={{
                position: 'absolute',
                left: 0,
                top: y * BLOCK_SIZE + 'px',
                width: BOARD_WIDTH * BLOCK_SIZE + 'px',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none'
              }}
            />
          ))}
          {Array.from({ length: BOARD_WIDTH + 1 }).map((_, x) => (
            <div
              key={`v-${x}`}
              style={{
                position: 'absolute',
                left: x * BLOCK_SIZE + 'px',
                top: 0,
                width: '1px',
                height: BOARD_HEIGHT * BLOCK_SIZE + 'px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;