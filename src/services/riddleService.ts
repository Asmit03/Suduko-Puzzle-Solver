import riddlesData from '@/data/riddles.json';

interface Riddle {
  id: number;
  question: string;
  answer: string;
  hint: string;
}

let usedRiddleIds: number[] = [];

export const getRandomRiddle = (): Riddle => {
  const availableRiddles = riddlesData.riddles.filter(riddle => !usedRiddleIds.includes(riddle.id));
  
  if (availableRiddles.length === 0) {
    // If all riddles have been used, reset the used riddles list
    usedRiddleIds = [];
    return getRandomRiddle();
  }
  
  const randomIndex = Math.floor(Math.random() * availableRiddles.length);
  const selectedRiddle = availableRiddles[randomIndex];
  usedRiddleIds.push(selectedRiddle.id);
  
  return selectedRiddle;
};

export const getRiddleHint = (riddleId: number): string => {
  const riddle = riddlesData.riddles.find(r => r.id === riddleId);
  return riddle?.hint || "No hint available";
};

export const verifyRiddleAnswer = (riddleId: number, answer: string): boolean => {
  const riddle = riddlesData.riddles.find(r => r.id === riddleId);
  if (!riddle) return false;
  
  // Case-insensitive comparison
  return riddle.answer.toLowerCase() === answer.toLowerCase();
}; 