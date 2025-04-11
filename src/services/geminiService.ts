import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const generateSudokuResponse = async (prompt: string, board: number[][]): Promise<string> => {
  try {
    console.log('Generating Sudoku response with prompt:', prompt);
    const boardString = board.map(row => row.join(' ')).join('\n');
    const fullPrompt = `You are a Sudoku expert. Here is the current board state:\n${boardString}\n\nUser question: ${prompt}\n\nPlease provide a helpful response that guides the user without directly giving away the solution.`;
    
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini API:', text);
    return text;
  } catch (error) {
    console.error('Detailed error in generateSudokuResponse:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to generate Sudoku response');
  }
};

export const generateBrainTeaser = async (): Promise<string> => {
  try {
    console.log('Generating brain teaser...');
    const prompt = "Generate a fun and challenging brain teaser or riddle. Make it mathematical or logical in nature. Don't include the answer in your response.";
    
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini API:', text);
    return text;
  } catch (error) {
    console.error('Detailed error in generateBrainTeaser:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to generate brain teaser');
  }
};

export const verifyBrainTeaserAnswer = async (teaser: string, answer: string): Promise<string> => {
  try {
    console.log('Verifying brain teaser answer...');
    const prompt = `Here is a brain teaser: "${teaser}"\n\nThe user answered: "${answer}"\n\nIs this answer correct? Please respond with "Correct!" if it's right, or provide a hint if it's wrong.`;
    
    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini API:', text);
    return text;
  } catch (error) {
    console.error('Detailed error in verifyBrainTeaserAnswer:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to verify brain teaser answer');
  }
}; 