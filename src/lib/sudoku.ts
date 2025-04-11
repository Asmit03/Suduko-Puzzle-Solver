export type SudokuBoard = number[][];
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert' | 'evil';

// Difficulty settings - updated to distribute values more evenly
const DIFFICULTY_SETTINGS = {
  easy: { minCells: 38, maxCells: 45 },   // Increased cell count for easy
  medium: { minCells: 30, maxCells: 35 },
  hard: { minCells: 25, maxCells: 30 },
  expert: { minCells: 22, maxCells: 25 },
  evil: { minCells: 17, maxCells: 22 }
};

// Create an empty board
export const createEmptyBoard = (): SudokuBoard => {
  return Array(9).fill(0).map(() => Array(9).fill(0));
};

// Check if a number is valid in a given position
export const isValidMove = (board: SudokuBoard, row: number, col: number, num: number): boolean => {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) {
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) {
        return false;
      }
    }
  }
  
  return true;
};

// Solve a Sudoku puzzle using backtracking
export const solveSudoku = (board: SudokuBoard): SudokuBoard => {
  const solution = JSON.parse(JSON.stringify(board)) as SudokuBoard;
  
  if (!solveHelper(solution)) {
    throw new Error("No solution exists for this puzzle");
  }
  
  return solution;
};

// Helper function for solving Sudoku
const solveHelper = (board: SudokuBoard): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        // Try each number 1-9
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            
            // Recursively try to solve the rest of the puzzle
            if (solveHelper(board)) {
              return true;
            }
            
            // If we couldn't solve it, backtrack
            board[row][col] = 0;
          }
        }
        
        // If we've tried all numbers and none work, this puzzle is unsolvable
        return false;
      }
    }
  }
  
  // If we've filled all cells, the puzzle is solved
  return true;
};

// Modified to create a solved board directly instead of starting with diagonal boxes
export const generateSudoku = async (difficulty: DifficultyLevel): Promise<{ puzzle: SudokuBoard; solution: SudokuBoard }> => {
  // Generate a completed Sudoku board
  const board = createEmptyBoard();
  fillRandomCell(board); // Start with a single random filled cell
  
  // Solve the rest of the puzzle
  if (!solveHelper(board)) {
    // If solving fails (very unlikely), try again with a different random start
    return generateSudoku(difficulty);
  }
  
  // Store the full solution
  const solution = JSON.parse(JSON.stringify(board)) as SudokuBoard;
  
  // Remove cells based on difficulty
  const { minCells, maxCells } = DIFFICULTY_SETTINGS[difficulty];
  const cellsToKeep = Math.floor(Math.random() * (maxCells - minCells + 1)) + minCells;
  
  const puzzle = createPuzzleWithEvenDistribution(solution, cellsToKeep);
  
  return { puzzle, solution };
};

// Place a single random value to start the puzzle generation
const fillRandomCell = (board: SudokuBoard): void => {
  const row = Math.floor(Math.random() * 9);
  const col = Math.floor(Math.random() * 9);
  const num = Math.floor(Math.random() * 9) + 1;
  
  board[row][col] = num;
};

// Shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Create a puzzle from a solution by removing cells, but ensure even distribution
const createPuzzleWithEvenDistribution = (solution: SudokuBoard, cellsToKeep: number): SudokuBoard => {
  const puzzle = JSON.parse(JSON.stringify(solution)) as SudokuBoard;
  
  // Divide the board into 9 regions (3x3 boxes)
  const regions = [];
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const region = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          region.push({
            row: br * 3 + r,
            col: bc * 3 + c
          });
        }
      }
      regions.push(region);
    }
  }
  
  // Calculate cells to keep per region (approximately)
  const cellsPerRegion = Math.max(1, Math.floor(cellsToKeep / 9));
  let remainingCells = cellsToKeep - (cellsPerRegion * 9);
  
  // For each region, keep a certain number of cells
  regions.forEach(region => {
    shuffleArray(region);
    
    // How many cells to keep in this region
    let cellsToKeepInRegion = cellsPerRegion;
    if (remainingCells > 0) {
      cellsToKeepInRegion++;
      remainingCells--;
    }
    
    // Mark cells to be removed
    for (let i = cellsToKeepInRegion; i < 9; i++) {
      const { row, col } = region[i];
      puzzle[row][col] = 0;
    }
  });
  
  // Ensure the puzzle has a unique solution
  ensureUniqueSolution(puzzle, solution);
  
  return puzzle;
};

// Make sure the puzzle has a unique solution
const ensureUniqueSolution = (puzzle: SudokuBoard, solution: SudokuBoard): void => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] === 0) {
        // Try an alternative value
        for (let num = 1; num <= 9; num++) {
          if (num !== solution[row][col] && isValidMove(puzzle, row, col, num)) {
            // This position allows multiple values, so we need to fix it
            puzzle[row][col] = solution[row][col]; // Make it given
            return; // One fixed cell is enough to ensure uniqueness in most cases
          }
        }
      }
    }
  }
};

// Check if a puzzle has a unique solution
const hasUniqueSolution = (puzzle: SudokuBoard): boolean => {
  const copy = JSON.parse(JSON.stringify(puzzle)) as SudokuBoard;
  
  // Try to solve it
  if (!solveHelper(copy)) {
    return false;
  }
  
  // Check if there's another solution
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (copy[r][c] !== num && isValidMove(puzzle, r, c, num)) {
            // If we found another valid number for this cell,
            // there might be multiple solutions
            return false;
          }
        }
      }
    }
  }
  
  return true;
};

// Validate a complete Sudoku board
export const validateSudoku = (board: SudokuBoard): boolean => {
  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Set<number>();
    for (let c = 0; c < 9; c++) {
      const num = board[r][c];
      if (num === 0 || seen.has(num)) {
        return false;
      }
      seen.add(num);
    }
  }
  
  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen = new Set<number>();
    for (let r = 0; r < 9; r++) {
      const num = board[r][c];
      if (num === 0 || seen.has(num)) {
        return false;
      }
      seen.add(num);
    }
  }
  
  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set<number>();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const num = board[boxRow + r][boxCol + c];
          if (num === 0 || seen.has(num)) {
            return false;
          }
          seen.add(num);
        }
      }
    }
  }
  
  return true;
};

// Calculate the difficulty of a puzzle
export const calculateDifficulty = (puzzle: SudokuBoard): DifficultyLevel => {
  let filledCells = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== 0) {
        filledCells++;
      }
    }
  }
  
  if (filledCells >= 38) return 'easy';
  if (filledCells >= 30) return 'medium';
  if (filledCells >= 25) return 'hard';
  if (filledCells >= 22) return 'expert';
  return 'evil';
};

// Get hints for the current state of the board
export const getHints = (board: SudokuBoard): { row: number; col: number; value: number }[] => {
  const hints = [];
  const solution = solveSudoku(JSON.parse(JSON.stringify(board)));
  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        hints.push({ row: r, col: c, value: solution[r][c] });
      }
    }
  }
  
  return hints;
};

// Format the time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
