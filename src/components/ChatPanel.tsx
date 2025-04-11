
import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '@/contexts/AIContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Lightbulb, Check, Eye, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const MessageItem: React.FC<{
  role: 'user' | 'assistant';
  content: string;
}> = ({ role, content }) => {
  const isUser = role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "mb-4 p-3 rounded-lg max-w-[80%]",
        isUser 
          ? "ml-auto bg-primary text-white rounded-br-none" 
          : "mr-auto bg-card rounded-bl-none"
      )}
    >
      <div className="whitespace-pre-wrap">{content}</div>
    </motion.div>
  );
};

const ChatPanel: React.FC = () => {
  const {
    messages,
    isLoading,
    chatMode,
    isBrainTeaserSolved,
    
    setChatMode,
    sendMessage,
    askForHint,
    askForNextMove,
    askForExplanation,
    askForBrainTeaser,
    verifyBrainTeaserAnswer,
    getBrainTeaserHint,
    revealBrainTeaserAnswer,
    clearMessages
  } = useAI();
  
  const [message, setMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      if (chatMode === 'brainteaser') {
        verifyBrainTeaserAnswer(message);
      } else {
        sendMessage(message);
      }
      setMessage('');
    }
  };
  
  const handleModeChange = (value: string) => {
    clearMessages();
    setChatMode(value as 'sudoku' | 'brainteaser');
    
    if (value === 'brainteaser') {
      askForBrainTeaser();
    }
  };
  
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="h-full flex flex-col"
    >
      <Card className="flex flex-col h-full overflow-hidden">
        <Tabs 
          defaultValue="sudoku" 
          value={chatMode}
          onValueChange={handleModeChange}
          className="w-full h-full flex flex-col overflow-hidden"
        >
          <div className="p-2 bg-muted/30">
            <TabsList className="w-full">
              <TabsTrigger value="sudoku" className="flex-1">
                <div className="flex items-center justify-center space-x-2">
                  <ChevronRight className="h-4 w-4" />
                  <span>Sudoku AI</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="brainteaser" className="flex-1">
                <div className="flex items-center justify-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Brain Teaser 🧠</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="sudoku" className="flex-1 flex flex-col m-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <MessageItem key={index} role={msg.role} content={msg.content} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4"
                  >
                    <div className="mb-6">
                      <div className="text-lg font-medium mb-2">Sudoku AI Assistant</div>
                      <p className="text-sm text-muted-foreground">
                        Ask for help, hints, or explanations about your Sudoku puzzle.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xs">
                      <Button variant="outline" onClick={askForHint} className="flex justify-start">
                        <Lightbulb className="h-4 w-4 mr-2" /> Get a Hint
                      </Button>
                      <Button variant="outline" onClick={askForNextMove} className="flex justify-start">
                        <ChevronRight className="h-4 w-4 mr-2" /> Next Move
                      </Button>
                      <Button variant="outline" onClick={askForExplanation} className="flex justify-start">
                        <Check className="h-4 w-4 mr-2" /> Explain Strategy
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  placeholder="Ask for help or advice..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="brainteaser" className="flex-1 flex flex-col m-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <MessageItem key={index} role={msg.role} content={msg.content} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  onClick={getBrainTeaserHint}
                  disabled={isLoading}
                >
                  <Lightbulb className="h-4 w-4 mr-2" /> Get Hint
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={revealBrainTeaserAnswer}
                  disabled={isLoading || isBrainTeaserSolved}
                >
                  <Eye className="h-4 w-4 mr-2" /> Reveal Answer
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={askForBrainTeaser}
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> New Teaser
                </Button>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  placeholder="Your answer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading || isBrainTeaserSolved}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !message.trim() || isBrainTeaserSolved}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default ChatPanel;
