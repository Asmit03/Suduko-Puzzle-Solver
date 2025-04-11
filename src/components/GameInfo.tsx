
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSudoku } from '@/contexts/SudokuContext';
import { formatTime } from '@/lib/sudoku';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const GameInfo: React.FC = () => {
  const { timer, difficulty, isLoading, isGameWon } = useSudoku();

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-blue-500';
      case 'hard': return 'text-orange-500';
      case 'expert': return 'text-red-500';
      case 'evil': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-lg mx-auto mb-4"
    >
      <Card>
        <CardHeader className="py-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Sudoku AI Brainwave</CardTitle>
              <CardDescription>Challenge your mind with puzzles</CardDescription>
            </div>
            
            {isLoading && (
              <div className="animate-spin">
                <Loader2 className="h-6 w-6" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <span className={`font-medium capitalize ${getDifficultyColor()}`}>
                {difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Time:</span>
              <span className="font-medium">{formatTime(timer)}</span>
            </div>
            
            {isGameWon && (
              <div className="text-green-500 font-medium animate-pulse">
                Solved!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GameInfo;
