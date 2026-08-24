# PrepPilot

> Your AI Co-Pilot for Interview Success

PrepPilot is an AI-powered interview preparation platform built to help candidates practice interviews in a more realistic way and understand where they can improve.

Instead of only giving a list of questions, PrepPilot lets you work with your own resume, take AI-generated mock interviews, answer questions, and receive a detailed evaluation of your performance.

## Live Demo

**Frontend:** https://prep-pilot-eosin-pi.vercel.app/

**GitHub:** https://github.com/Vaibhavjain-00/PrepPilot

## What PrepPilot Does

### Authentication

- Sign up and login with email and password
- Email verification
- Forgot password and password reset flow
- Google login
- JWT-based authentication with access and refresh tokens
- Protected routes

### Resume Management

Users can upload their resume and manage it from the application.

PrepPilot:

- Uploads resumes to Cloudinary
- Extracts resume text from PDF/DOCX files
- Uses AI to identify skills, education, experience, and projects
- Lets users review and update extracted resume information
- Allows users to replace or delete their resume

### AI Mock Interviews

Users can create and take mock interviews based on their preparation needs.

The interview flow includes:

1. Interview setup
2. Interview preparation
3. Question-by-question interview
4. Answer submission
5. AI evaluation
6. Final result and feedback

The evaluation provides an overall score as well as question-wise feedback.

The AI feedback also explains what could be improved in an answer, rather than only giving a score.

### Dashboard

The dashboard acts as the main place for users to keep track of their interview preparation.

It brings together interview activity, results, and useful preparation information in one place.

### Interview History

Completed interviews can be viewed later so users can look back at their previous performance.

### Profile

The profile section gives users a place to view their account information and manage their resume-related information.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- React Hot Toast
- Google OAuth

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod
- Helmet
- CORS
- Express Rate Limit
- Multer

### AI & Resume Processing

- Google Gemini API
- PDF parsing
- DOCX parsing
- AI-based resume information extraction
- AI-based interview question generation
- AI-based interview evaluation
- Background AI processing with Redis and BullMQ

### Queue & Real-Time Processing

- Redis
- BullMQ
- Socket.io

### Storage & Services

- MongoDB Atlas
- Cloudinary
- Brevo SMTP
- Vercel
- Render

## Project Structure

```text
PrepPilot/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── store/
│   └── package.json
│
└── PRD.md
```

## How the Main Flow Works

```text
User
  │
  ▼
Login / Signup
  │
  ▼
Upload Resume
  │
  ├── Cloudinary
  ├── Text Extraction
  └── AI Resume Parsing
          │
          ▼
     Interview Setup
          │
          ▼
     AI Interview
          │
          ▼
     Submit Answers
          │
          ▼
     AI Evaluation
          │
          ▼
  Score + Feedback + Improvements
          │
          ▼
       Dashboard
```

## Authentication

PrepPilot uses JWT-based authentication.

The application uses:

- Short-lived access tokens
- Refresh tokens
- HTTP-only cookies in production
- Protected API routes
- Role information for authorization
- Google OAuth as an alternative login method

Passwords are hashed using bcrypt before being stored.

## Resume Parsing

When a user uploads a resume, the backend first extracts its text.

The extracted content is then processed by the AI resume parser to identify useful information such as:

- Skills
- Education
- Experience
- Projects
- Certifications

The parsed information is stored in MongoDB and can be used during interview preparation.

## Background AI Processing

PrepPilot uses Redis and BullMQ for long-running AI tasks. Interview generation and evaluation are not kept inside the main API request. The API creates a job, BullMQ puts it in a queue, and a worker processes the job in the background.

This makes the interview flow more reliable and allows failed AI jobs to be retried with backoff.

## AI Evaluation

After an interview is completed, PrepPilot evaluates the candidate's answers using AI.

The result includes:

- Overall score
- Overall feedback
- Question-wise score
- Question-wise feedback
- Suggestions about what could be improved

The goal is to make the evaluation useful for the next attempt, rather than simply showing a number.

## Deployment

The current production setup uses:

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
Files     → Cloudinary
Email     → Brevo
```

Docker/containerization is kept as a future improvement and is not required for the current deployment.

## Environment Variables

Create `.env` files for the frontend and backend based on the provided `.env.sample` files.

Do not commit real credentials, API keys, JWT secrets, SMTP passwords, or other sensitive values to GitHub.

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Make sure the required environment variables are configured before starting the application.

## Why I Built PrepPilot

I wanted to build something that goes beyond a basic CRUD project.

While working on PrepPilot, I worked with authentication, protected routes, REST APIs, MongoDB, resume processing, AI integration, file uploads, email services, deployment, and frontend state management.

The main idea was to build a practical application that could actually be used for interview preparation while also learning how the different parts of a modern full-stack application fit together.

## Future Improvements

Some ideas that can be added later include:

- More advanced real-time evaluation updates using Socket.io
- Live coding rounds
- Secure code execution using Docker
- Recruiter dashboard
- Admin dashboard
- More detailed performance analytics
- Notifications when evaluation is ready

## Author

**Vaibhav Jain**

GitHub: https://github.com/Vaibhavjain-00
