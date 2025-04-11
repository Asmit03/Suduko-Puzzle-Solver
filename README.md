# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2e853815-a3ff-47d1-adc3-537043384d29

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2e853815-a3ff-47d1-adc3-537043384d29) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2e853815-a3ff-47d1-adc3-537043384d29) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Sudoku AI with Brain Teasers

An interactive Sudoku game with AI assistance and brain teasers powered by Google's Gemini AI.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000 (or the next available port if 3000 is in use).

## Features

- Interactive Sudoku game with multiple difficulty levels
- AI-powered hints and assistance using Gemini AI
- Brain teasers and riddles for extra challenge
- Timer and progress tracking
- Pencil mode for notes
- Undo/redo functionality
- Mobile-responsive design

## Development

- Built with React + Vite
- TypeScript for type safety
- Tailwind CSS for styling
- Google's Gemini AI for intelligent responses
- React Query for data management
- React Router for navigation
