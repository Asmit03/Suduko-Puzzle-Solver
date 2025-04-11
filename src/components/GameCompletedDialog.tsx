
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSudoku } from '@/contexts/SudokuContext';
import { formatTime } from '@/lib/sudoku';
import { motion, useAnimate } from 'framer-motion';
import confetti from 'canvas-confetti';

const GameCompletedDialog: React.FC = () => {
  const { isGameWon, timer, difficulty, newGame } = useSudoku();
  const [isOpen, setIsOpen] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isGameWon) {
      setIsOpen(true);
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Animate the dialog
      animate(scope.current, 
        { scale: [0.9, 1.05, 1] },
        { duration: 0.5, ease: "easeOut" }
      );
    } else {
      setIsOpen(false);
    }
  }, [isGameWon, animate, scope]);

  const handleNewGame = () => {
    setIsOpen(false);
    newGame();
  };

  // Get message based on time and difficulty
  const getMessage = () => {
    const minutes = Math.floor(timer / 60);
    
    if (difficulty === 'evil' && minutes < 10) {
      return "Incredible! You have exceptional skills!";
    } else if (difficulty === 'expert' && minutes < 12) {
      return "Outstanding performance! You're a true Sudoku master!";
    } else if (difficulty === 'hard' && minutes < 15) {
      return "Excellent work! Your skills are impressive!";
    } else if (difficulty === 'medium' && minutes < 20) {
      return "Well done! You're getting really good at this!";
    } else {
      return "Congratulations on completing the puzzle!";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" ref={scope}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🎉 Puzzle Solved! 🎉
            </motion.div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {getMessage()}
            </motion.div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-sm font-medium text-muted-foreground">Time</span>
            <span className="text-2xl font-bold">{formatTime(timer)}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-sm font-medium text-muted-foreground">Difficulty</span>
            <span className="text-2xl font-bold capitalize">{difficulty}</span>
          </motion.div>
        </div>
        
        <DialogFooter>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full"
          >
            <Button onClick={handleNewGame} className="w-full">
              Play Another Puzzle
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameCompletedDialog;
