import { trainGemini } from './services/geminiTraining';

async function runTraining() {
    try {
        console.log('Starting Gemini training test...');
        await trainGemini();
        console.log('Training test completed successfully!');
    } catch (error) {
        console.error('Error during training test:', error);
    }
}

runTraining(); 