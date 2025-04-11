
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSudoku } from '@/contexts/SudokuContext';
import { motion } from 'framer-motion';
import { Timer, RotateCcw, RefreshCcw, Undo, Redo, Lightbulb } from 'lucide-react';
import { formatTime } from '@/lib/sudoku';
import { cn } from '@/lib/utils';

const SudokuControls: React.FC = () => {
  const {
    timer,
    isTimerRunning,
    toggleTimer,
    resetGame,
    newGame,
    undo,
    redo,
    history,
    historyIndex,
    getHint
  } = useSudoku();

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2
      }
    },
    whileTap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="mt-4 w-full max-w-lg mx-auto"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Timer Display */}
        <Button
          variant="outline"
          className={cn(
            "text-lg flex items-center justify-center space-x-2 h-12",
            !isTimerRunning && "bg-muted"
          )}
          onClick={toggleTimer}
        >
          <Timer className="h-5 w-5" />
          <span>{formatTime(timer)}</span>
        </Button>
        
        {/* Controls */}
        <div className="flex space-x-2">
          <motion.div variants={buttonVariants} whileTap="whileTap" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants} whileTap="whileTap" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
        
        <motion.div variants={buttonVariants} whileTap="whileTap">
          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center space-x-2"
            onClick={resetGame}
          >
            <RefreshCcw className="h-5 w-5" />
            <span>Reset</span>
          </Button>
        </motion.div>
        
        <motion.div variants={buttonVariants} whileTap="whileTap">
          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center space-x-2"
            onClick={newGame}
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Game</span>
          </Button>
        </motion.div>
        
        <motion.div variants={buttonVariants} whileTap="whileTap" className="col-span-2">
          <Button
            variant="default"
            className="w-full h-12 bg-sudoku-primary hover:bg-sudoku-primary/90 flex items-center justify-center space-x-2"
            onClick={getHint}
          >
            <Lightbulb className="h-5 w-5" />
            <span>Get Hint</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SudokuControls;
