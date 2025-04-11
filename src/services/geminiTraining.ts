import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Training examples for different Sudoku techniques
const trainingExamples = {
  basicTechniques: [
    {
      board: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ],
      technique: 'Single Candidate',
      explanation: 'Look for cells that can only contain one possible number based on the numbers already present in the row, column, and 3x3 box.',
      hint: 'In the first row, the number 4 can only go in one position.'
    },
    {
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 8, 5],
        [0, 0, 1, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 7, 0, 0, 0],
        [0, 0, 4, 0, 0, 0, 1, 0, 0],
        [0, 9, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 7, 3],
        [0, 0, 2, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 9]
      ],
      technique: 'Hidden Single',
      explanation: 'A number can only go in one position within a row, column, or box, even though other numbers might also be possible in that cell.',
      hint: 'In the first column, the number 3 can only go in one position.'
    }
  ],
  advancedTechniques: [
    {
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      technique: 'Naked Pair',
      explanation: 'When two cells in a row, column, or box can only contain the same two numbers, those numbers can be eliminated from other cells in that unit.',
      hint: 'Look for two cells in a row that can only contain the same two numbers.'
    }
  ]
};

// Training prompts for different aspects of Sudoku solving
const trainingPrompts = {
  basicSolving: `You are a Sudoku expert. Your task is to help users solve Sudoku puzzles by providing helpful hints and explanations. 
  Focus on teaching basic techniques like:
  1. Single Candidate - Finding cells that can only contain one number
  2. Hidden Single - Finding numbers that can only go in one position
  3. Scanning - Looking for obvious placements in rows, columns, and boxes
  
  When providing hints:
  - Be encouraging and positive
  - Explain the technique you're suggesting
  - Don't give away the answer directly
  - Help users develop their own solving skills`,
  
  advancedSolving: `You are a Sudoku expert. Your task is to help users with more advanced Sudoku techniques. 
  Focus on teaching techniques like:
  1. Naked Pairs/Triples
  2. Hidden Pairs/Triples
  3. Pointing Pairs
  4. Box/Line Reduction
  
  When providing hints:
  - Explain the technique clearly
  - Show how to identify the pattern
  - Guide users through the logic
  - Help them understand why the technique works`,
  
  strategyGuide: `You are a Sudoku expert. Your task is to help users develop effective solving strategies.
  Teach them:
  1. How to approach a new puzzle
  2. When to use different techniques
  3. How to avoid common mistakes
  4. How to develop a systematic approach
  
  When providing guidance:
  - Be methodical and clear
  - Explain the reasoning behind each step
  - Help users build confidence
  - Encourage logical thinking`
};

export const trainGemini = async () => {
  try {
    console.log('Starting Gemini training...');
    
    // Train on basic techniques
    for (const example of trainingExamples.basicTechniques) {
      const prompt = `${trainingPrompts.basicSolving}\n\nHere's a puzzle to practice with:\n${formatBoard(example.board)}\n\nTechnique: ${example.technique}\nExplanation: ${example.explanation}\nHint: ${example.hint}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(`Training response for ${example.technique}:`, response.text());
    }
    
    // Train on advanced techniques
    for (const example of trainingExamples.advancedTechniques) {
      const prompt = `${trainingPrompts.advancedSolving}\n\nHere's a puzzle to practice with:\n${formatBoard(example.board)}\n\nTechnique: ${example.technique}\nExplanation: ${example.explanation}\nHint: ${example.hint}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(`Training response for ${example.technique}:`, response.text());
    }
    
    // Train on strategy
    const strategyPrompt = trainingPrompts.strategyGuide;
    const result = await model.generateContent(strategyPrompt);
    const response = await result.response;
    console.log('Strategy training response:', response.text());
    
    console.log('Gemini training completed successfully!');
  } catch (error) {
    console.error('Error during Gemini training:', error);
    throw new Error('Failed to complete Gemini training');
  }
};

// Helper function to format the board for display
const formatBoard = (board: number[][]): string => {
  return board.map(row => row.map(cell => cell === 0 ? '.' : cell).join(' ')).join('\n');
};

// Export the training examples and prompts for use in other modules
export { trainingExamples, trainingPrompts }; 