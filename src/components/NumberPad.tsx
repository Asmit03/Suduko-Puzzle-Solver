
import React from 'react';
import { useSudoku } from '@/contexts/SudokuContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Eraser, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

const NumberPad: React.FC = () => {
  const { inputNumber, clearCell, isPencilMode, togglePencilMode } = useSudoku();

  const handleNumberClick = (num: number) => {
    inputNumber(num);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.2,
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
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.div 
            key={num} 
            variants={buttonVariants}
            whileTap="whileTap"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-lg font-semibold border-2"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          </motion.div>
        ))}
        
        <motion.div variants={buttonVariants} whileTap="whileTap">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "w-full h-12 border-2",
              isPencilMode && "bg-primary/10 border-primary"
            )}
            onClick={togglePencilMode}
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div variants={buttonVariants} whileTap="whileTap">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 border-2"
            onClick={clearCell}
          >
            <Eraser className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NumberPad;
