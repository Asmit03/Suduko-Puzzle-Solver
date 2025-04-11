
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSudoku } from '@/contexts/SudokuContext';
import { DifficultyLevel } from '@/lib/sudoku';
import { motion } from 'framer-motion';

const DifficultySelector: React.FC = () => {
  const { difficulty, setDifficulty, isLoading } = useSudoku();

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as DifficultyLevel);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="mt-4 w-full max-w-lg mx-auto"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <div className="text-center mb-2 font-semibold text-lg">Difficulty</div>
        <RadioGroup
          value={difficulty}
          onValueChange={handleDifficultyChange}
          className="flex justify-center space-x-4"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="easy" id="easy" />
            <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert" className="cursor-pointer">Expert</Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="evil" id="evil" />
            <Label htmlFor="evil" className="cursor-pointer">Evil</Label>
          </div>
        </RadioGroup>
      </div>
    </motion.div>
  );
};

export default DifficultySelector;
