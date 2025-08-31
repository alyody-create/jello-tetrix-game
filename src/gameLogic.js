// Tetris piece definitions with rotation states
export const TETRIS_PIECES = {
  I: {
    shape: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ]
    ],
    color: 'block-i'
  },
  O: {
    shape: [
      [
        [1, 1],
        [1, 1]
      ]
    ],
    color: 'block-o'
  },
  T: {
    shape: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: 'block-t'
  },
  S: {
    shape: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ]
    ],
    color: 'block-s'
  },
  Z: {
    shape: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ]
    ],
    color: 'block-z'
  },
  J: {
    shape: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ],
    color: 'block-j'
  },
  L: {
    shape: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: 'block-l'
  }
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BLOCK_SIZE = 30;

// Game configuration
export const GAME_CONFIG = {
  INITIAL_DROP_TIME: 1000,
  LEVEL_SPEED_INCREASE: 0.1,
  POINTS_PER_LINE: [0, 100, 300, 500, 800],
  POINTS_PER_LEVEL: 1000
};

// Create empty board
export const createEmptyBoard = () => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

// Get random piece
export const getRandomPiece = () => {
  const pieces = Object.keys(TETRIS_PIECES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    type: randomPiece,
    shape: TETRIS_PIECES[randomPiece].shape[0],
    color: TETRIS_PIECES[randomPiece].color,
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0,
    rotation: 0
  };
};

// Rotate piece
export const rotatePiece = (piece) => {
  const { type, rotation } = piece;
  const shapes = TETRIS_PIECES[type].shape;
  const newRotation = (rotation + 1) % shapes.length;
  
  return {
    ...piece,
    shape: shapes[newRotation],
    rotation: newRotation
  };
};

// Check collision
export const isValidMove = (board, piece, dx = 0, dy = 0, newShape = null) => {
  const shape = newShape || piece.shape;
  const newX = piece.x + dx;
  const newY = piece.y + dy;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = newX + x;
        const boardY = newY + y;

        // Check boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with existing blocks
        if (boardY >= 0 && board[boardY][boardX]) {
          return false;
        }
      }
    }
  }
  return true;
};

// Place piece on board
export const placePiece = (board, piece) => {
  const newBoard = board.map(row => [...row]);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    });
  });

  return newBoard;
};

// Clear completed lines
export const clearLines = (board) => {
  const completedLines = [];
  const newBoard = [];

  board.forEach((row, index) => {
    if (row.every(cell => cell !== null)) {
      completedLines.push(index);
    } else {
      newBoard.push([...row]);
    }
  });

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return {
    board: newBoard,
    linesCleared: completedLines.length,
    clearedLineIndices: completedLines
  };
};

// Calculate score
export const calculateScore = (linesCleared, level) => {
  return GAME_CONFIG.POINTS_PER_LINE[linesCleared] * (level + 1);
};

// Get drop time based on level
export const getDropTime = (level) => {
  return Math.max(50, GAME_CONFIG.INITIAL_DROP_TIME - (level * 50));
};