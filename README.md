# AI Resume Analyzer

A production-ready Full Stack application that analyzes your resume against a target job description using Google's Gemini AI, calculating an ATS score, identifying missing keywords, and generating a customized summary and cover letter.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express, MongoDB Atlas, Multer, `pdf-parse`, Google GenAI

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the `server/` directory and add the following:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-analyzer
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
*(Note: You can replace `MONGODB_URI` with your MongoDB Atlas string, and make sure to add your real Gemini API key).*

### 2. Installation
Run the following command from the root directory to install all dependencies for both the frontend and backend:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Running the App locally
You can start both the client and server concurrently from the root directory:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Features
- Secure JWT Authentication
- PDF Text Extraction
- Deep ATS Scoring via Gemini AI
- Trend Analysis Dashboard
- Resume History Tracking
- Premium, Animated SaaS UI with Dark Mode
