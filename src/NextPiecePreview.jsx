import React from 'react';
import { BLOCK_SIZE } from './gameLogic';

const NextPiecePreview = ({ nextPiece }) => {
  if (!nextPiece) return null;

  const { shape, color } = nextPiece;
  
  return (
    <div className="next-piece-preview">
      {shape.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`tetris-block ${cell ? color : ''}`}
            style={{
              position: 'absolute',
              left: x * (BLOCK_SIZE * 0.7) + 10 + 'px',
              top: y * (BLOCK_SIZE * 0.7) + 10 + 'px',
              width: (BLOCK_SIZE * 0.7) + 'px',
              height: (BLOCK_SIZE * 0.7) + 'px',
              opacity: cell ? 1 : 0
            }}
          />
        ))
      )}
    </div>
  );
};

export default NextPiecePreview;