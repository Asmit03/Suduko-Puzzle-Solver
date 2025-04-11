
import React from 'react';
import { SudokuProvider } from '@/contexts/SudokuContext';
import { AIProvider } from '@/contexts/AIContext';
import SudokuGrid from '@/components/SudokuGrid';
import NumberPad from '@/components/NumberPad';
import SudokuControls from '@/components/SudokuControls';
import DifficultySelector from '@/components/DifficultySelector';
import ChatPanel from '@/components/ChatPanel';
import GameInfo from '@/components/GameInfo';
import GameCompletedDialog from '@/components/GameCompletedDialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  return (
    <SudokuProvider>
      <AIProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Main Content */}
          <div className="flex-1 container mx-auto py-6 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Panel - Sudoku Game */}
              <div className="lg:col-span-3 space-y-4">
                <ScrollArea className="h-[calc(100vh-2rem)]">
                  <div className="space-y-4 pr-4">
                    <GameInfo />
                    <SudokuGrid />
                    <NumberPad />
                    <SudokuControls />
                    <Separator className="my-4" />
                    <DifficultySelector />
                  </div>
                </ScrollArea>
              </div>
              
              {/* Right Panel - AI Chatbot */}
              <div className="lg:col-span-2 h-[calc(100vh-2rem)]">
                <ChatPanel />
              </div>
            </div>
          </div>
          
          {/* Game Completed Dialog */}
          <GameCompletedDialog />
        </div>
      </AIProvider>
    </SudokuProvider>
  );
};

export default Index;
