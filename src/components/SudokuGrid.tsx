
import React, { useEffect } from 'react';
import { useSudoku } from '@/contexts/SudokuContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const SudokuCell: React.FC<{
  row: number;
  col: number;
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  notes: number[];
  hasConflict: boolean;
  onClick: () => void;
}> = ({ row, col, value, isGiven, isSelected, isHighlighted, notes, hasConflict, onClick }) => {
  const cellRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cellRef.current) {
      cellRef.current.focus();
    }
  }, [isSelected]);

  // Calculate border styles
  const borderTop = row % 3 === 0 ? 'border-t-2 border-sudoku-dark' : 'border-t border-gray-300';
  const borderLeft = col % 3 === 0 ? 'border-l-2 border-sudoku-dark' : 'border-l border-gray-300';
  const borderRight = col === 8 ? 'border-r-2 border-sudoku-dark' : '';
  const borderBottom = row === 8 ? 'border-b-2 border-sudoku-dark' : '';

  const variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <div
      ref={cellRef}
      className={cn(
        'sudoku-cell',
        borderTop,
        borderLeft,
        borderRight,
        borderBottom,
        isSelected && 'selected',
        isHighlighted && !isSelected && 'highlighted',
        isGiven && 'given',
        hasConflict && 'conflict'
      )}
      onClick={onClick}
      tabIndex={0}
    >
      {value > 0 ? (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl"
        >
          {value}
        </motion.div>
      ) : notes.length > 0 ? (
        <div className="notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className={cn(notes.includes(n) ? 'opacity-100' : 'opacity-0')}>
              {notes.includes(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const SudokuGrid: React.FC = () => {
  const {
    board,
    originalBoard,
    selectedCell,
    setSelectedCell,
    notes,
    conflicts
  } = useSudoku();

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  // Determine which cells should be highlighted based on the selected cell
  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    
    const [selectedRow, selectedCol] = selectedCell;
    
    // Same row, column, or 3x3 box
    return (
      row === selectedRow ||
      col === selectedCol ||
      (Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
        Math.floor(col / 3) === Math.floor(selectedCol / 3))
    );
  };

  const gridContainerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.03
      }
    }
  };

  const rowVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const cellVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-lg mx-auto"
      variants={gridContainerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="grid grid-cols-9 border-2 border-sudoku-dark rounded-lg overflow-hidden shadow-lg bg-white">
        {board.map((row, rowIndex) => (
          <motion.div key={rowIndex} className="contents" variants={rowVariants}>
            {row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const isGiven = originalBoard[rowIndex][colIndex] !== 0;
              const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
              const cellNotes = notes[cellKey] || [];
              const hasConflict = !!conflicts[cellKey];

              return (
                <motion.div 
                  key={colIndex} 
                  className="aspect-square"
                  variants={cellVariants}
                >
                  <SudokuCell
                    row={rowIndex}
                    col={colIndex}
                    value={cell}
                    isGiven={isGiven}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted(rowIndex, colIndex)}
                    notes={cellNotes}
                    hasConflict={hasConflict}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SudokuGrid;
