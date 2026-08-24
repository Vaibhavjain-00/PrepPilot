# PrepPilot — Product Requirements Document

## 1. Product Overview

**PrepPilot** is an AI-powered interview preparation platform that helps candidates practice mock interviews, use their resume as part of their preparation, and understand how they can improve their answers.

The product is designed around a simple idea: interview practice should not stop at asking questions. Candidates should also receive useful, understandable feedback after every attempt.

---

## 2. Problem Statement

Interview preparation often involves solving questions from different websites, practicing alone, and getting little or no personalized feedback.

PrepPilot aims to bring the main parts of this process into one application:

- Manage a resume
- Prepare for interviews
- Take AI-powered mock interviews
- Receive question-wise feedback
- Understand areas for improvement
- Track previous interview attempts

---

## 3. Product Goal

Build a practical, full-stack interview preparation platform where a candidate can:

1. Create an account.
2. Verify their email or use Google login.
3. Upload and manage a resume.
4. Extract useful information from the resume using AI.
5. Start an AI-powered mock interview.
6. Submit answers question by question.
7. Receive an AI-generated evaluation.
8. Review scores, feedback, and improvement suggestions.
9. View previous interview attempts from the dashboard/history.

---

## 4. Current Implemented Features

### 4.1 Authentication

- Email/password signup
- Email verification
- Login
- Logout
- Forgot password
- Password reset
- Google OAuth login
- JWT access and refresh tokens
- HTTP-only cookie based authentication in production
- Protected routes
- Candidate/recruiter/admin role field in the user model

### 4.2 Resume Management

A candidate can maintain one active resume.

The system supports:

- Resume upload
- Resume replacement
- Resume deletion
- Resume retrieval
- PDF/DOCX text extraction
- AI-based resume parsing
- Extracted skills
- Education
- Experience
- Projects
- Certifications
- Editing parsed resume information

Resume files are stored using Cloudinary.

### 4.3 Interview Preparation

The application provides an interview setup flow followed by an interview preparation screen and the actual interview.

The interview experience supports:

- Interview setup
- Generated interview questions
- Question-by-question answering
- Answer submission
- Interview completion
- Evaluation state
- Final evaluation/result page

### 4.4 AI Evaluation

The AI evaluates submitted answers and produces:

- Per-question score
- Per-question feedback
- Improvement points within the feedback
- Overall score
- Overall feedback

The evaluation is stored so the candidate can review it later.

### 4.5 Dashboard

The application has an overall candidate dashboard rather than treating the dashboard as only an interview screen.

The dashboard is intended to give the user a quick view of their preparation activity and results.

### 4.6 Interview History

Candidates can view previous interviews and open their evaluation/results again.

### 4.7 Profile

The profile page provides account information and resume-related management.

It is designed to let the user view their profile, see resume information, and manage their current resume.

---

## 5. User Roles

The user model currently supports:

| Role      | Purpose                                          |
| --------- | ------------------------------------------------ |
| Candidate | Main interview preparation user                  |
| Recruiter | Reserved for future recruiter functionality      |
| Admin     | Reserved for future administration functionality |

Candidate functionality is the primary implemented product flow.

Recruiter and Admin functionality should not be described as completed features until those dashboards and workflows are implemented.

---

## 6. Main User Flow

```text
Signup / Login
      ↓
Email Verification
      ↓
Dashboard
      ↓
Upload Resume
      ↓
Resume Text Extraction
      ↓
AI Resume Parsing
      ↓
Interview Setup
      ↓
Interview Preparation
      ↓
Mock Interview
      ↓
Submit Answers
      ↓
Evaluation
      ↓
Score + Feedback + Improvements
      ↓
Dashboard / Interview History
```

---

## 7. Resume Requirements

### Functional Requirements

- A user can upload a resume.
- The backend extracts text from the uploaded file.
- The extracted text is sent to the AI resume parser.
- Parsed skills, education, experience, projects, and certifications are stored.
- The user can update parsed information.
- The user can replace the existing resume.
- The user can delete the resume.
- Resume files are stored on Cloudinary.

### Resume Data

A resume can contain:

- Skills
- Education
- Experience
- Projects
- Certifications
- Extracted text
- File URL
- Cloudinary public ID
- Parsing status
- Parsing timestamp

---

## 8. Interview Requirements

### Functional Requirements

- User can configure an interview.
- System generates interview questions.
- User answers questions sequentially.
- Candidate answers are stored.
- Interview can enter an evaluation state after completion.
- Final evaluation can be viewed separately from the active interview.

### Evaluation Requirements

Each evaluated question should provide:

- Score
- Candidate answer
- AI feedback
- Practical improvement guidance

The overall evaluation should provide:

- Overall score
- Overall feedback

---

## 9. Dashboard Requirements

The dashboard should remain focused on the overall preparation experience.

It can surface:

- Recent interviews
- Previous scores
- Interview activity
- Resume status
- Useful preparation information
- Links to start another interview
- Links to interview history and profile

The dashboard should not be described as an interviewer-only dashboard.

---

## 10. Profile Requirements

The profile page should provide:

- User information
- Current resume information
- Resume upload/replacement
- Resume deletion
- Extracted skills
- Other parsed resume information where useful

---

## 11. Authentication & Security

The application uses:

- bcrypt for password hashing
- JWT authentication
- Access and refresh tokens
- HTTP-only cookies
- Explicit CORS configuration
- Helmet
- Rate limiting
- Input validation using Zod
- Protected API routes

Sensitive credentials must remain in environment variables and must never be committed to the repository.

---

## 12. Technology Stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
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
- Nodemailer
- Mailgen

### AI & Processing

- Google Gemini API
- PDF parsing
- DOCX parsing
- AI-based resume parsing
- AI-based interview question generation
- AI-based interview evaluation
- Background AI processing using Redis and BullMQ

### Queue & Real-Time Processing

- Redis
- BullMQ
- Socket.io

### External Services

- MongoDB Atlas
- Cloudinary
- Mailtrap SMTP (For Development)
- Brevo SMTP (For Production)
- Vercel
- Render

---

## 13. Deployment

Current production architecture:

```text
React Frontend
      ↓
    Vercel
      ↓
Node/Express API
      ↓
    Render
      ↓
MongoDB Atlas
```

Additional services:

```text
Cloudinary → Resume/file storage
Brevo      → Transactional email
Gemini     → AI processing
```

Docker is not part of the current production deployment. Containerization is a future improvement.

---

## 14. Architecture Direction

The current application primarily follows a frontend/backend split with background workers for long-running AI tasks:

```text
Frontend
  React + Redux
       ↓
 REST API
       ↓
Backend
 Node + Express
       ↓
 MongoDB
```

The backend is organized into controllers, routes, models, services, middleware, configuration, and utilities.

Long-running AI processing is handled through background jobs using BullMQ and Redis. Interview generation and evaluation are processed by workers so the main API request does not have to wait for the AI work to finish.

---

## 15. Future Improvements

The following are planned/future features rather than current completed functionality:

### Real-Time Features

- Socket.io integration improvements
- Live interview/evaluation status updates
- Real-time evaluation-ready notifications

### Background Processing

- Redis is used as the queue backend
- BullMQ manages background jobs
- Interview generation runs in a background worker
- Interview evaluation runs in a background worker
- Retry and exponential backoff handling for failed jobs

### Coding Round

- In-browser coding editor
- Coding questions
- Test-case execution
- Secure code execution
- Docker-based sandbox

### Recruiter Features

- Recruiter dashboard
- Interview templates
- Candidate reports
- Interview scheduling

### Admin Features

- User management
- Platform analytics
- AI usage monitoring
- System health monitoring

### Analytics

- Score trends
- Skill-wise performance
- More detailed progress tracking

---

## 16. Non-Goals for the Current Version

The current version does not aim to provide:

- Native mobile applications
- Video interviews with facial/emotion analysis
- Payment/subscription billing
- Full recruiter workflows
- Full admin workflows
- Docker-based code execution

These can be considered future extensions.

---

## 17. Project Status

**Current status: Deployed and usable MVP**

The core candidate experience is implemented and deployed.

The project is intentionally being kept stable at this stage. Future development can focus on improving real-time updates, coding rounds, analytics, and recruiter/admin functionality. Background processing with Redis and BullMQ is already part of the implemented interview flow.

---

## 18. Development Philosophy

PrepPilot is being developed as a practical learning and portfolio project while keeping the architecture close to what a real production application would need.

The focus is on:

- Clean separation between frontend and backend
- Secure authentication
- Reusable services and components
- Real external service integrations
- Useful AI features instead of AI being added only as a demo
- Clear user feedback during long-running operations
- Production deployment
