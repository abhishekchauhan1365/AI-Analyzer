# AI Resume Analyzer 🚀

An advanced, full-stack AI-powered platform that analyzes resumes, calculates ATS compatibility, and provides tailored feedback to help job seekers land their dream roles. 

Built with **React**, **Node.js/Express**, and powered by **Google's Gemini AI**.

---

## ✨ Features

- **Intelligent Resume Parsing**: Upload PDF resumes and extract text instantly using memory-efficient buffer parsing.
- **AI Executive Summary & Scoring**: Get an overall resume score (0-100), an ATS compatibility score, and a comprehensive summary written by Gemini AI.
- **ATS Job Match Simulator**: Compare your resume against predefined industry roles (e.g., "Frontend Developer") or paste a custom Job Description. The AI will calculate a match percentage and identify missing critical keywords.
- **Persistent AI Document Chat**: Have a two-way conversation with your resume! Ask the AI to summarize your experience or find specific details. Chat sessions are saved to the database and persist across page reloads.
- **Rewrite Assistant**: Highlight weak bullet points and have the AI instantly suggest stronger, more impactful alternatives using action verbs and quantifiable metrics.
- **Premium Glassmorphism UI**: A stunning, modern interface featuring deep-blur glass cards, interactive Recharts data visualizations, and smooth Framer Motion micro-animations.

---

## 🛠️ Tech Stack

### Frontend (Deployed on Vercel)
- **Framework**: React (Vite) + TypeScript
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Routing**: React Router DOM
- **State/Fetching**: React Query (TanStack Query), Axios

### Backend (Deployed on Render)
- **Server**: Node.js + Express + TypeScript
- **Database**: MongoDB (Mongoose ORM)
- **AI Engine**: `@google/genai` (Gemini 3.5 Flash Lite)
- **Authentication**: JWT (JSON Web Tokens) via Bearer Auth Header
- **File Parsing**: `pdf-parse`, `multer` (Memory Storage)

---

## 🏗️ Architecture

The application uses a decoupled frontend-backend architecture to bypass serverless function limitations (like Vercel's 10-second timeout on free tiers).

1. **Frontend (Vercel)**: Serves the static React bundle. Communicates with the backend via HTTPS APIs. Authentication tokens are securely stored in `localStorage` and attached as `Authorization: Bearer <token>` headers.
2. **Backend (Render)**: A persistent Node.js server that handles long-running AI tasks, PDF processing, and MongoDB connections. It uses a dynamic CORS policy to securely accept requests from the Vercel frontend.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB URI (e.g., MongoDB Atlas)
- Google Gemini API Key

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/abhishekchauhan1365/AI-Analyzer.git
cd AI-Analyzer
\`\`\`

### 2. Setup the Backend
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173
\`\`\`

Start the backend development server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Setup the Frontend
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`

Create a `.env` file in the `frontend` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

---

## 📡 Core API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Login and receive JWT
- \`GET /api/auth/me\` - Get current user profile

### Analysis
- \`POST /api/analyses/upload\` - Upload a PDF and trigger background AI analysis
- \`GET /api/analyses\` - Get paginated list of user's past analyses
- \`GET /api/analyses/:id/status\` - Poll for analysis completion status
- \`POST /api/analyses/:id/match\` - Run ATS Job Match Simulator

### Chat
- \`GET /api/analyses/:id/chats\` - Retrieve persistent chat history
- \`POST /api/analyses/:id/chat\` - Stream a new AI message using Server-Sent Events (SSE)

---

## 💡 Future Enhancements
- Export AI-optimized resumes directly to PDF/Word.
- Implement OAuth (Google/GitHub) login.
- Add support for `.docx` file uploads.
