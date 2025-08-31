import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  createEmptyBoard,
  getRandomPiece,
  rotatePiece,
  isValidMove,
  placePiece,
  clearLines,
  calculateScore,
  getDropTime,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from './gameLogic';

export const useGameLogic = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameOver
  const [dropTime, setDropTime] = useState(getDropTime(0));
  const [settings, setSettings] = useState({
    volume: 0.5,
    particles: true,
    difficultMode: false
  });
  
  const gameLoopRef = useRef();
  const lastDropRef = useRef(0);
  const [clearedLines, setClearedLines] = useState([]);
  const [particles, setParticles] = useState([]);

  // Initialize game
  const initGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setScore(0);
    setLevel(0);
    setLines(0);
    setGameState('playing');
    setDropTime(getDropTime(0));
    setClearedLines([]);
    setParticles([]);
    lastDropRef.current = Date.now();
  }, []);

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (gameState !== 'playing' || !currentPiece) return false;

    if (isValidMove(board, currentPiece, dx, dy)) {
      setCurrentPiece(prev => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
      return true;
    }
    return false;
  }, [board, currentPiece, gameState]);

  // Rotate piece
  const rotatePieceAction = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;

    const rotatedPiece = rotatePiece(currentPiece);
    if (isValidMove(board, currentPiece, 0, 0, rotatedPiece.shape)) {
      setCurrentPiece(rotatedPiece);
      
      // Add jello effect
      triggerJelloEffect();
    }
  }, [board, currentPiece, gameState]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;

    let dropDistance = 0;
    while (isValidMove(board, currentPiece, 0, dropDistance + 1)) {
      dropDistance++;
    }

    if (dropDistance > 0) {
      setCurrentPiece(prev => ({
        ...prev,
        y: prev.y + dropDistance
      }));
      
      // Add particles for hard drop
      createParticles(
        currentPiece.x * 30 + 150, 
        (currentPiece.y + dropDistance) * 30 + 150,
        8,
        '#ff6b6b' // Red color for hard drops
      );
    }
  }, [board, currentPiece, gameState]);

  // Place piece and spawn next
  const placePieceAndSpawnNext = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = placePiece(board, currentPiece);
    const { board: clearedBoard, linesCleared, clearedLineIndices } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    setClearedLines(clearedLineIndices);
    
    // Update score and level
    if (linesCleared > 0) {
      const newScore = score + calculateScore(linesCleared, level);
      const newLines = lines + linesCleared;
      const newLevel = Math.floor(newLines / 10);
      
      setScore(newScore);
      setLines(newLines);
      setLevel(newLevel);
      setDropTime(getDropTime(newLevel));
      
      // Create particles for line clear
      clearedLineIndices.forEach(lineIndex => {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          createParticles(
            x * 30 + 150 + Math.random() * 30, 
            lineIndex * 30 + 150 + Math.random() * 30,
            3,
            '#ffd700' // Gold color for line clears
          );
        }
      });
      
      // Clear the cleared lines array after animation
      setTimeout(() => setClearedLines([]), 500);
    }

    // Spawn next piece
    const newPiece = { ...nextPiece };
    if (!isValidMove(clearedBoard, newPiece)) {
      setGameState('gameOver');
      return;
    }

    setCurrentPiece(newPiece);
    setNextPiece(getRandomPiece());
  }, [board, currentPiece, nextPiece, score, level, lines]);

  // Create particle effect
  const createParticles = useCallback((x, y, count = 5, color = null) => {
    if (!settings.particles) return;
    
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random() + Date.now(),
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * -4 - 2,
        life: 1,
        color: color || `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: Math.random() * 4 + 2,
        createdAt: Date.now()
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2500);
  }, [settings.particles]);

  // Trigger jello effect
  const triggerJelloEffect = useCallback(() => {
    const gameGrid = document.querySelector('.game-grid');
    if (gameGrid) {
      gameGrid.classList.add('jello-effect');
      setTimeout(() => {
        gameGrid.classList.remove('jello-effect');
      }, 600);
    }
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    if (now - lastDropRef.current > dropTime) {
      if (!movePiece(0, 1)) {
        placePieceAndSpawnNext();
      }
      lastDropRef.current = now;
    }
  }, [gameState, dropTime, movePiece, placePieceAndSpawnNext]);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 16); // ~60fps
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameLoop, gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (movePiece(0, 1)) {
            setScore(prev => prev + 1); // Soft drop bonus
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceAction();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          initGame();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePiece, rotatePieceAction, hardDrop, initGame]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
      lastDropRef.current = Date.now();
    }
  }, [gameState]);

  // Restart game
  const restartGame = useCallback(() => {
    initGame();
  }, [initGame]);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get display board (current board + current piece)
  const getDisplayBoard = useCallback(() => {
    if (!currentPiece) return board;

    const displayBoard = board.map(row => [...row]);
    
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });

    return displayBoard;
  }, [board, currentPiece]);

  // Optimize particle cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const now = Date.now();
        return prev.filter(particle => {
          const age = now - particle.createdAt;
          return age < 2500; // Remove particles older than 2.5 seconds
        });
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Optimize board rendering
  const memoizedBoard = useMemo(() => getDisplayBoard(), [board, currentPiece]);

  return {
    board: memoizedBoard,
    currentPiece,
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
  };
};