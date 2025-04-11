import { generateSudokuResponse, generateBrainTeaser, verifyBrainTeaserAnswer } from './services/geminiService';

async function testGemini() {
    try {
        // Test Sudoku response
        const sudokuBoard = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        
        console.log('Testing Sudoku response...');
        const sudokuResponse = await generateSudokuResponse('What should I do next?', sudokuBoard);
        console.log('Sudoku Response:', sudokuResponse);

        // Test Brain Teaser
        console.log('\nTesting Brain Teaser...');
        const brainTeaser = await generateBrainTeaser();
        console.log('Brain Teaser:', brainTeaser);

        // Test Answer Verification
        console.log('\nTesting Answer Verification...');
        const verification = await verifyBrainTeaserAnswer(brainTeaser, 'test answer');
        console.log('Verification Response:', verification);

    } catch (error) {
        console.error('Error testing Gemini:', error);
    }
}

testGemini(); 