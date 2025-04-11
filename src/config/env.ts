const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn('Warning: VITE_GEMINI_API_KEY is not set in environment variables');
}

export const config = {
  geminiApiKey,
}; 