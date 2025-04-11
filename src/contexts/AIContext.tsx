import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useSudoku } from '@/contexts/SudokuContext';
import { useToast } from '@/hooks/use-toast';
import { generateSudokuResponse } from '@/services/geminiService';
import { getRandomRiddle, getRiddleHint, verifyRiddleAnswer } from '@/services/riddleService';
import riddlesData from '@/data/riddles.json';

type ChatMode = 'sudoku' | 'brainteaser';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIContextProps {
  messages: Message[];
  isLoading: boolean;
  chatMode: ChatMode;
  isBrainTeaserSolved: boolean;
  currentBrainTeaser: string | null;
  
  setChatMode: (mode: ChatMode) => void;
  sendMessage: (message: string) => Promise<void>;
  askForHint: () => Promise<void>;
  askForNextMove: () => Promise<void>;
  askForExplanation: () => Promise<void>;
  askForBrainTeaser: () => Promise<void>;
  verifyBrainTeaserAnswer: (answer: string) => Promise<void>;
  getBrainTeaserHint: () => Promise<void>;
  revealBrainTeaserAnswer: () => Promise<void>;
  clearMessages: () => void;
}

const AIContext = createContext<AIContextProps | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const { board } = useSudoku();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('sudoku');
  const [isBrainTeaserSolved, setIsBrainTeaserSolved] = useState(false);
  const [currentRiddle, setCurrentRiddle] = useState<{ id: number; question: string } | null>(null);

  // Send a message to the AI
  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await generateSudokuResponse(message, board);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [board, toast]);

  // Ask for a hint for the current Sudoku puzzle
  const askForHint = useCallback(async () => {
    setIsLoading(true);
    const message = "I need a hint for the current board, but don't directly tell me the answer. Just give me a hint about what to look for.";
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await generateSudokuResponse(message, board);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error asking for hint:', error);
      toast({
        title: "Error",
        description: "Failed to get a hint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [board, toast]);

  // Ask for the next best move
  const askForNextMove = useCallback(async () => {
    setIsLoading(true);
    const message = "What's the next best move I should make?";
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await generateSudokuResponse(message, board);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error asking for next move:', error);
      toast({
        title: "Error",
        description: "Failed to get the next move. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [board, toast]);

  // Ask for an explanation of solving techniques
  const askForExplanation = useCallback(async () => {
    setIsLoading(true);
    const message = "Can you explain the solving technique that would be useful for this board?";
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await generateSudokuResponse(message, board);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error asking for explanation:', error);
      toast({
        title: "Error",
        description: "Failed to get an explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [board, toast]);

  // Ask for a brain teaser
  const askForBrainTeaser = useCallback(async () => {
    setIsLoading(true);
    setIsBrainTeaserSolved(false);
    setMessages([]);

    try {
      const riddle = getRandomRiddle();
      setCurrentRiddle({ id: riddle.id, question: riddle.question });
      setMessages([{ role: 'assistant', content: riddle.question }]);
    } catch (error) {
      console.error('Error getting brain teaser:', error);
      toast({
        title: "Error",
        description: "Failed to get a brain teaser. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Verify a brain teaser answer
  const verifyBrainTeaserAnswer = useCallback(async (answer: string) => {
    if (!currentRiddle) return;
    
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: answer }]);

    try {
      const isCorrect = verifyRiddleAnswer(currentRiddle.id, answer);
      const response = isCorrect 
        ? "Correct! Well done on solving the riddle!"
        : "Not quite right. Try again!";
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (isCorrect) {
        setIsBrainTeaserSolved(true);
        toast({
          title: "Great job!",
          description: "You solved the riddle!",
        });
      }
    } catch (error) {
      console.error('Error verifying answer:', error);
      toast({
        title: "Error",
        description: "Failed to verify your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRiddle, toast]);

  // Get a hint for the brain teaser
  const getBrainTeaserHint = useCallback(async () => {
    if (!currentRiddle) return;
    
    setIsLoading(true);
    const message = "Can I get a hint?";
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const hint = getRiddleHint(currentRiddle.id);
      setMessages(prev => [...prev, { role: 'assistant', content: hint }]);
    } catch (error) {
      console.error('Error getting hint:', error);
      toast({
        title: "Error",
        description: "Failed to get a hint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRiddle]);

  // Reveal the brain teaser answer
  const revealBrainTeaserAnswer = useCallback(async () => {
    if (!currentRiddle) return;
    
    setIsLoading(true);
    const message = "Please reveal the answer.";
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const riddle = riddlesData.riddles.find(r => r.id === currentRiddle.id);
      if (riddle) {
        setMessages(prev => [...prev, { role: 'assistant', content: `The answer is: ${riddle.answer}` }]);
        setIsBrainTeaserSolved(true);
      }
    } catch (error) {
      console.error('Error revealing answer:', error);
      toast({
        title: "Error",
        description: "Failed to reveal the answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRiddle, toast]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const contextValue: AIContextProps = {
    messages,
    isLoading,
    chatMode,
    isBrainTeaserSolved,
    currentBrainTeaser: currentRiddle ? currentRiddle.question : null,
    
    setChatMode,
    sendMessage,
    askForHint,
    askForNextMove,
    askForExplanation,
    askForBrainTeaser,
    verifyBrainTeaserAnswer,
    getBrainTeaserHint,
    revealBrainTeaserAnswer,
    clearMessages,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};
