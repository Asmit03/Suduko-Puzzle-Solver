
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { generateSudoku, solveSudoku, validateSudoku, SudokuBoard, DifficultyLevel } from '@/lib/sudoku';
import { useToast } from '@/hooks/use-toast';

interface SudokuContextProps {
  board: SudokuBoard;
  originalBoard: SudokuBoard;
  selectedCell: [number, number] | null;
  isPencilMode: boolean;
  difficulty: DifficultyLevel;
  isLoading: boolean;
  timer: number;
  isTimerRunning: boolean;
  history: { board: SudokuBoard; notes: Record<string, number[]> }[];
  historyIndex: number;
  notes: Record<string, number[]>;
  isGameWon: boolean;
  conflicts: Record<string, boolean>;
  
  // Actions
  setSelectedCell: (cell: [number, number] | null) => void;
  togglePencilMode: () => void;
  setDifficulty: (level: DifficultyLevel) => void;
  newGame: () => void;
  resetGame: () => void;
  solvePuzzle: () => void;
  inputNumber: (num: number) => void;
  clearCell: () => void;
  undo: () => void;
  redo: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  getHint: () => void;
}

const SudokuContext = createContext<SudokuContextProps | undefined>(undefined);

export const useSudoku = () => {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error('useSudoku must be used within a SudokuProvider');
  }
  return context;
};

interface SudokuProviderProps {
  children: ReactNode;
}

export const SudokuProvider: React.FC<SudokuProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [originalBoard, setOriginalBoard] = useState<SudokuBoard>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [history, setHistory] = useState<{ board: SudokuBoard; notes: Record<string, number[]> }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [isGameWon, setIsGameWon] = useState(false);
  const [conflicts, setConflicts] = useState<Record<string, boolean>>({});

  // Initialize a new game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    try {
      const { puzzle, solution } = await generateSudoku(difficulty);
      setBoard(JSON.parse(JSON.stringify(puzzle)));
      setOriginalBoard(JSON.parse(JSON.stringify(puzzle)));
      setHistory([{ board: JSON.parse(JSON.stringify(puzzle)), notes: {} }]);
      setHistoryIndex(0);
      setNotes({});
      setIsGameWon(false);
      setConflicts({});
      resetTimer();
      setIsTimerRunning(true);
    } catch (error) {
      console.error("Failed to initialize game:", error);
      toast({
        title: "Error",
        description: "Failed to initialize the game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, toast]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isTimerRunning && !isGameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isGameWon]);

  // Check if the game is won
  useEffect(() => {
    if (board.length > 0 && !isLoading) {
      const allFilled = board.every(row => row.every(cell => cell !== 0));
      if (allFilled) {
        const isValid = validateSudoku(board);
        if (isValid) {
          setIsGameWon(true);
          setIsTimerRunning(false);
          toast({
            title: "Congratulations!",
            description: "You've successfully solved the puzzle!",
          });
        }
      }
    }
  }, [board, isLoading, toast]);

  // Save state to history
  const saveToHistory = useCallback((newBoard: SudokuBoard, newNotes: Record<string, number[]>) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      board: JSON.parse(JSON.stringify(newBoard)),
      notes: JSON.parse(JSON.stringify(newNotes))
    });
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Input a number into the selected cell
  const inputNumber = useCallback((num: number) => {
    if (!selectedCell || isGameWon) return;
    
    const [row, col] = selectedCell;
    if (originalBoard[row][col] !== 0) return; // Can't modify given cells
    
    const newBoard = JSON.parse(JSON.stringify(board));
    const newNotes = { ...notes };
    
    if (isPencilMode) {
      const cellKey = `${row}-${col}`;
      const cellNotes = newNotes[cellKey] || [];
      
      if (cellNotes.includes(num)) {
        newNotes[cellKey] = cellNotes.filter(n => n !== num);
        if (newNotes[cellKey].length === 0) {
          delete newNotes[cellKey];
        }
      } else {
        newNotes[cellKey] = [...cellNotes, num].sort((a, b) => a - b);
      }
      
      setNotes(newNotes);
    } else {
      newBoard[row][col] = num;
      delete newNotes[`${row}-${col}`];
      
      // Check for conflicts
      const newConflicts: Record<string, boolean> = {};
      
      // Check row
      for (let c = 0; c < 9; c++) {
        if (c !== col && newBoard[row][c] === num) {
          newConflicts[`${row}-${c}`] = true;
          newConflicts[`${row}-${col}`] = true;
        }
      }
      
      // Check column
      for (let r = 0; r < 9; r++) {
        if (r !== row && newBoard[r][col] === num) {
          newConflicts[`${r}-${col}`] = true;
          newConflicts[`${row}-${col}`] = true;
        }
      }
      
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && newBoard[r][c] === num) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${row}-${col}`] = true;
          }
        }
      }
      
      setConflicts(newConflicts);
      setBoard(newBoard);
    }
    
    saveToHistory(newBoard, newNotes);
  }, [selectedCell, isGameWon, board, originalBoard, isPencilMode, notes, saveToHistory]);

  // Clear the selected cell
  const clearCell = useCallback(() => {
    if (!selectedCell || isGameWon) return;
    
    const [row, col] = selectedCell;
    if (originalBoard[row][col] !== 0) return; // Can't modify given cells
    
    const newBoard = JSON.parse(JSON.stringify(board));
    const newNotes = { ...notes };
    
    newBoard[row][col] = 0;
    delete newNotes[`${row}-${col}`];
    
    // Recalculate conflicts
    const newConflicts: Record<string, boolean> = {};
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c] === 0) continue;
        
        // Check row
        for (let c2 = 0; c2 < 9; c2++) {
          if (c2 !== c && newBoard[r][c] === newBoard[r][c2] && newBoard[r][c] !== 0) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${r}-${c2}`] = true;
          }
        }
        
        // Check column
        for (let r2 = 0; r2 < 9; r2++) {
          if (r2 !== r && newBoard[r][c] === newBoard[r2][c] && newBoard[r][c] !== 0) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${r2}-${c}`] = true;
          }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        
        for (let r2 = boxRow; r2 < boxRow + 3; r2++) {
          for (let c2 = boxCol; c2 < boxCol + 3; c2++) {
            if ((r2 !== r || c2 !== c) && newBoard[r][c] === newBoard[r2][c2] && newBoard[r][c] !== 0) {
              newConflicts[`${r}-${c}`] = true;
              newConflicts[`${r2}-${c2}`] = true;
            }
          }
        }
      }
    }
    
    setConflicts(newConflicts);
    setBoard(newBoard);
    setNotes(newNotes);
    
    saveToHistory(newBoard, newNotes);
  }, [selectedCell, isGameWon, board, originalBoard, notes, saveToHistory]);

  // Toggle pencil mode
  const togglePencilMode = useCallback(() => {
    setIsPencilMode(prev => !prev);
  }, []);

  // Create a new game
  const newGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Reset the current game
  const resetGame = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(originalBoard)));
    setNotes({});
    setConflicts({});
    setHistory([{ board: JSON.parse(JSON.stringify(originalBoard)), notes: {} }]);
    setHistoryIndex(0);
    resetTimer();
    setIsTimerRunning(true);
    setIsGameWon(false);
  }, [originalBoard]);

  // Solve the puzzle
  const solvePuzzle = useCallback(() => {
    try {
      const solution = solveSudoku(originalBoard);
      setBoard(solution);
      setNotes({});
      setConflicts({});
      setIsGameWon(true);
      setIsTimerRunning(false);
    } catch (error) {
      console.error("Failed to solve puzzle:", error);
      toast({
        title: "Error",
        description: "Failed to solve the puzzle. It might be unsolvable.",
        variant: "destructive",
      });
    }
  }, [originalBoard, toast]);

  // Get a hint for the next move
  const getHint = useCallback(() => {
    if (isGameWon) return;
    
    try {
      const solution = solveSudoku(originalBoard);
      
      // Find an empty cell that needs to be filled
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            const newBoard = JSON.parse(JSON.stringify(board));
            newBoard[r][c] = solution[r][c];
            
            setBoard(newBoard);
            setSelectedCell([r, c]);
            
            const newNotes = { ...notes };
            delete newNotes[`${r}-${c}`];
            
            saveToHistory(newBoard, newNotes);
            return;
          }
        }
      }
      
      toast({
        title: "No Hints Available",
        description: "All cells are already filled.",
      });
    } catch (error) {
      console.error("Failed to get hint:", error);
      toast({
        title: "Error",
        description: "Failed to get a hint. Please try again.",
        variant: "destructive",
      });
    }
  }, [isGameWon, originalBoard, board, notes, saveToHistory, toast]);

  // Undo the last move
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const prevState = history[historyIndex - 1];
    setBoard(JSON.parse(JSON.stringify(prevState.board)));
    setNotes(JSON.parse(JSON.stringify(prevState.notes)));
    setHistoryIndex(historyIndex - 1);
    
    // Recalculate conflicts
    const newConflicts: Record<string, boolean> = {};
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (prevState.board[r][c] === 0) continue;
        
        // Check row
        for (let c2 = 0; c2 < 9; c2++) {
          if (c2 !== c && prevState.board[r][c] === prevState.board[r][c2] && prevState.board[r][c] !== 0) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${r}-${c2}`] = true;
          }
        }
        
        // Check column
        for (let r2 = 0; r2 < 9; r2++) {
          if (r2 !== r && prevState.board[r][c] === prevState.board[r2][c] && prevState.board[r][c] !== 0) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${r2}-${c}`] = true;
          }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        
        for (let r2 = boxRow; r2 < boxRow + 3; r2++) {
          for (let c2 = boxCol; c2 < boxCol + 3; c2++) {
            if ((r2 !== r || c2 !== c) && prevState.board[r][c] === prevState.board[r2][c2] && prevState.board[r][c] !== 0) {
              newConflicts[`${r}-${c}`] = true;
              newConflicts[`${r2}-${c2}`] = true;
            }
          }
        }
      }
    }
    
    setConflicts(newConflicts);
  }, [history, historyIndex]);

  // Redo the last undone move
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const nextState = history[historyIndex + 1];
    setBoard(JSON.parse(JSON.stringify(nextState.board)));
    setNotes(JSON.parse(JSON.stringify(nextState.notes)));
    setHistoryIndex(historyIndex + 1);
    
    // Recalculate conflicts
    const newConflicts: Record<string, boolean> = {};
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (nextState.board[r][c] === 0) continue;
        
        // Check row
        for (let c2 = 0; c2 < 9; c2++) {
          if (c2 !== c && nextState.board[r][c] === nextState.board[r][c2] && nextState.board[r][c] !== 0) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${r}-${c2}`] = true;
          }
        }
        
        // Check column
        for (let r2 = 0; r2 < 9; r2++) {
          if (r2 !== r && nextState.board[r][c] === nextState.board[r2][c] && nextState.board[r][c] !== 0) {
            newConflicts[`${r}-${c}`] = true;
            newConflicts[`${r2}-${c}`] = true;
          }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        
        for (let r2 = boxRow; r2 < boxRow + 3; r2++) {
          for (let c2 = boxCol; c2 < boxCol + 3; c2++) {
            if ((r2 !== r || c2 !== c) && nextState.board[r][c] === nextState.board[r2][c2] && nextState.board[r][c] !== 0) {
              newConflicts[`${r}-${c}`] = true;
              newConflicts[`${r2}-${c2}`] = true;
            }
          }
        }
      }
    }
    
    setConflicts(newConflicts);
  }, [history, historyIndex]);

  // Toggle the timer
  const toggleTimer = useCallback(() => {
    setIsTimerRunning(prev => !prev);
  }, []);

  // Reset the timer
  const resetTimer = useCallback(() => {
    setTimer(0);
  }, []);

  const contextValue: SudokuContextProps = {
    board,
    originalBoard,
    selectedCell,
    isPencilMode,
    difficulty,
    isLoading,
    timer,
    isTimerRunning,
    history,
    historyIndex,
    notes,
    isGameWon,
    conflicts,
    
    setSelectedCell,
    togglePencilMode,
    setDifficulty,
    newGame,
    resetGame,
    solvePuzzle,
    inputNumber,
    clearCell,
    undo,
    redo,
    toggleTimer,
    resetTimer,
    getHint,
  };

  return (
    <SudokuContext.Provider value={contextValue}>
      {children}
    </SudokuContext.Provider>
  );
};
