**AI-Powered Interview Preparation Platform**

*Software Requirements & Project Build Document*

MERN Stack Capstone Project \| Prepared for a guided, phase-wise build

**1. Introduction**

**1.1 Purpose of this Document**

This document defines what the AI Interview Preparation Platform must do, how it should be built, and in what order, so that it can be developed step-by-step while learning the MERN stack (MongoDB, Express, React, Node.js). It combines a Software Requirements Specification (SRS) with a practical build roadmap, so it can be used both as a reference and as a week-by-week task list.

**1.2 Problem Statement**

Job seekers preparing for technical interviews rarely get realistic, personalized, and repeatable practice. Mock interviews with real people are expensive, hard to schedule, and inconsistent in feedback quality. Candidates need a platform that can generate role-specific interview questions, simulate a real spoken interview, evaluate answers with AI, let them solve live coding problems, and track their improvement over time — all without needing a human interviewer.

**1.3 Project Goal**

Build a full-stack, AI-powered mock interview platform where a candidate can upload a resume, receive a personalized interview based on their target role and experience level, go through a voice-based Q&A round, attempt a live coding round, and receive an AI-generated evaluation with a score, strengths, and areas to improve — visible on a personal analytics dashboard.

**1.4 Learning Objectives (why this project is a good MERN capstone)**

- Full MERN CRUD app with authentication and role-based access control (RBAC).

- Integration with a third-party generative AI API (Gemini or OpenAI) for content generation and evaluation.

- Browser Speech-to-Text / Text-to-Speech APIs for a voice interview experience.

- Real-time features using Socket.io (live coding sessions, live interview status).

- Background job processing with BullMQ + Redis (e.g., AI evaluation queue).

- Secure code execution using Docker containers (coding round sandbox).

- File uploads and storage using Cloudinary (resumes, profile images).

- Production deployment across multiple services (Vercel, Render/Railway, MongoDB Atlas).

**2. Scope**

**2.1 In Scope (MVP – build this first)**

- Candidate registration/login (email+password and Google OAuth).

- Resume upload and automatic skill/experience extraction.

- AI-generated interview questions based on role, company, and difficulty.

- Voice-based interview round using browser Speech-to-Text and Text-to-Speech.

- AI evaluation of spoken/text answers with a score and written feedback.

- Live coding round with an in-browser code editor and sandboxed execution.

- Candidate dashboard showing past interviews, scores, and progress over time.

**2.2 In Scope (Phase 2 – add once MVP works)**

- Recruiter role: create interview templates, view candidate reports, schedule interviews.

- Admin role: manage users, monitor AI usage/costs, view platform-wide analytics.

- Leaderboards and gamification (streaks, badges).

- Real-time notifications (interview reminders, evaluation-ready alerts).

**2.3 Out of Scope (do not attempt initially)**

- Native mobile apps (web-responsive only for v1).

- Video-based interviews with facial expression/emotion analysis.

- Payment/subscription billing (can be a future add-on).

- Multi-language support beyond English.

**3. User Roles & Personas**

|           |                                            |                                                                                                      |
|-----------|--------------------------------------------|------------------------------------------------------------------------------------------------------|
| **Role**  | **Description**                            | **Key Capabilities**                                                                                 |
| Candidate | Primary end user preparing for interviews. | Register/login, upload resume, take AI interviews, attempt coding rounds, view dashboard & progress. |
| Recruiter | Uses the platform to evaluate candidates.  | Create/customize interview templates, view candidate reports, schedule interviews for candidates.    |
| Admin     | Platform owner/operator.                   | Manage users and roles, configure AI models/prompts, view platform-wide analytics and system health. |

**4. User Workflow (End-to-End)**

1.  Candidate registers or logs in (JWT session, optional Google OAuth).

2.  Candidate uploads a resume (PDF/DOCX) via the dashboard.

3.  Backend stores the file in Cloudinary and parses it to extract skills, education, and experience.

4.  Candidate selects a target role, company (optional), and difficulty level.

5.  AI Interview Generator (Gemini/OpenAI) creates a set of tailored questions based on parsed resume + selections.

6.  Voice Interview round begins: system reads a question aloud (Text-to-Speech), candidate answers aloud (Speech-to-Text converts it to text).

7.  For technical roles, a Live Coding round follows: candidate solves a problem in the Monaco editor; code runs in an isolated Docker sandbox.

8.  AI Evaluation service scores each answer/submission, generates feedback, and stores results (processed via a BullMQ background job so the UI stays responsive).

9.  Dashboard updates with the new interview record, score trend, and specific improvement suggestions.

**5. Functional Requirements**

**5.1 Authentication & User Management**

|        |                                                                                                     |
|--------|-----------------------------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                                     |
| FR-1   | Users can register with name, email, and password (hashed with bcrypt).                             |
| FR-2   | Users can log in and receive a short-lived JWT access token plus a long-lived refresh token.        |
| FR-3   | Users can log in via Google OAuth as an alternative to email/password.                              |
| FR-4   | System enforces role-based access control (Candidate / Recruiter / Admin) on every protected route. |
| FR-5   | Users can update their profile and reset a forgotten password via emailed link.                     |

**5.2 Resume Upload & Parsing**

|        |                                                                                             |
|--------|---------------------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                             |
| FR-6   | Candidate can upload a resume file (PDF/DOCX, max size enforced) to Cloudinary.             |
| FR-7   | System extracts text from the resume and identifies skills, education, and past experience. |
| FR-8   | Extracted data is editable by the candidate before it's used to generate an interview.      |

**5.3 AI Interview Generation**

|        |                                                                                                                                                                |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                                                                                                |
| FR-9   | Candidate selects target role, optional target company, and difficulty (Easy/Medium/Hard).                                                                     |
| FR-10  | System calls the AI provider (Gemini/OpenAI) with a prompt built from resume data + selections to generate a structured question set (behavioral + technical). |
| FR-11  | Generated questions are stored against the interview record for reuse and audit.                                                                               |

**5.4 Voice Interview**

|        |                                                                                                         |
|--------|---------------------------------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                                         |
| FR-12  | System reads each question aloud using the Web Speech Synthesis API.                                    |
| FR-13  | Candidate's spoken answer is captured and transcribed via the Web Speech Recognition API.               |
| FR-14  | Candidate can re-record an answer before submitting; a visible timer limits response time per question. |

**5.5 Live Coding Round**

|        |                                                                                          |
|--------|------------------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                          |
| FR-15  | Candidate is presented with a coding problem and an in-browser Monaco code editor.       |
| FR-16  | Submitted code executes inside an isolated Docker container with CPU/memory/time limits. |
| FR-17  | System returns pass/fail results per test case along with runtime.                       |

**5.6 AI Evaluation & Feedback**

|        |                                                                                                                             |
|--------|-----------------------------------------------------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                                                             |
| FR-18  | Each transcribed answer and coding submission is sent to the AI evaluator for scoring against expected criteria.            |
| FR-19  | Evaluation runs as a background job (BullMQ + Redis) so the candidate isn't blocked waiting on the AI response.             |
| FR-20  | System returns a numeric score, written feedback, and specific improvement tips per question and for the interview overall. |

**5.7 Dashboard & Analytics**

|        |                                                                                   |
|--------|-----------------------------------------------------------------------------------|
| **ID** | **Requirement**                                                                   |
| FR-21  | Candidate can view a list of past interviews with date, role, and overall score.  |
| FR-22  | Candidate can view a score trend chart across attempts and a per-skill breakdown. |
| FR-23  | Recruiter/Admin dashboards show aggregate data across candidates (Phase 2).       |

**6. Non-Functional Requirements**

|                 |                                                                                                                                                       |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Category**    | **Requirement**                                                                                                                                       |
| Performance     | Standard API responses under 300ms; AI-dependent operations handled asynchronously with job status polling or Socket.io updates.                      |
| Scalability     | Stateless Express API behind a process manager; Redis-backed queues so multiple workers can process AI jobs in parallel.                              |
| Security        | Passwords hashed with bcrypt; JWT + refresh token rotation; input validation and sanitization on every endpoint; rate limiting on auth and AI routes. |
| Reliability     | Failed AI/job calls retried with backoff (BullMQ); user-facing errors are graceful, never raw stack traces.                                           |
| Usability       | Responsive UI (mobile/tablet/desktop); clear loading and error states, especially during AI-generation waits.                                         |
| Maintainability | Modular backend (controllers/services/routes separated); documented environment variables; consistent code style (ESLint/Prettier).                   |
| Portability     | Environment-based configuration so the same code runs locally, in staging, and in production without changes.                                         |

**7. System Architecture**

The platform follows a modular, service-oriented architecture within a monorepo-style split of frontend and backend:

- Client (React) talks to the API over REST for CRUD operations and over Socket.io for real-time events (coding session updates, evaluation-ready notifications).

- Express API delegates long-running work (AI generation, AI evaluation, code execution) to background workers via BullMQ queues backed by Redis, instead of handling them inline in the request.

- A Docker-based sandbox service executes untrusted candidate code in isolation, with strict resource and time limits, and returns results to the API.

- MongoDB Atlas is the system of record; Redis is used for queues and caching; Cloudinary stores uploaded files (resumes, avatars).

- Gemini/OpenAI APIs are called only from the backend (never directly from the client) to protect API keys and control cost/rate limits.

**8. Technology Stack**

**8.1 Frontend**

|                  |                                                     |
|------------------|-----------------------------------------------------|
| **Technology**   | **Purpose**                                         |
| React            | Core UI library / component architecture.           |
| Redux Toolkit    | Global state (auth, interview session state).       |
| React Query      | Server-state caching, API data fetching/refetching. |
| Tailwind CSS     | Utility-first styling.                              |
| React Router     | Client-side routing.                                |
| Socket.io Client | Real-time updates (coding session, notifications).  |
| Monaco Editor    | In-browser code editor for the coding round.        |

**8.2 Backend**

|                     |                                                   |
|---------------------|---------------------------------------------------|
| **Technology**      | **Purpose**                                       |
| Node.js + Express   | REST API server.                                  |
| MongoDB + Mongoose  | Primary database and schema modeling.             |
| Redis               | Caching and BullMQ queue backend.                 |
| BullMQ              | Background job processing (AI calls, evaluation). |
| Socket.io           | Real-time server-to-client communication.         |
| JWT                 | Stateless authentication.                         |
| Cloudinary          | File storage (resumes, images).                   |
| Gemini / OpenAI API | Question generation and answer evaluation.        |
| Docker              | Isolated sandbox for executing candidate code.    |

**9. Database Design**

MongoDB collections (Mongoose schemas), with primary fields:

**9.1 User**

|                       |                        |                                           |
|-----------------------|------------------------|-------------------------------------------|
| **Field**             | **Type**               | **Notes**                                 |
| name                  | String                 | Required.                                 |
| email                 | String                 | Required, unique.                         |
| password              | String                 | Hashed (bcrypt); omitted for OAuth users. |
| role                  | String                 | candidate \| recruiter \| admin.          |
| resume                | ObjectId (ref: Resume) | Latest uploaded resume.                   |
| createdAt / updatedAt | Date                   | Timestamps.                               |

**9.2 Resume**

|            |                      |                                       |
|------------|----------------------|---------------------------------------|
| **Field**  | **Type**             | **Notes**                             |
| userId     | ObjectId (ref: User) | Owner.                                |
| fileUrl    | String               | Cloudinary URL.                       |
| skills     | \[String\]           | Extracted/edited skills.              |
| education  | \[Object\]           | Degree, institute, year.              |
| experience | \[Object\]           | Company, role, duration, description. |

**9.3 Interview**

|            |                              |                                         |
|------------|------------------------------|-----------------------------------------|
| **Field**  | **Type**                     | **Notes**                               |
| userId     | ObjectId (ref: User)         | Candidate.                              |
| role       | String                       | Target role (e.g., Backend Developer).  |
| company    | String                       | Optional target company.                |
| difficulty | String                       | easy \| medium \| hard.                 |
| questions  | \[ObjectId\] (ref: Question) | Generated question set.                 |
| score      | Number                       | Overall evaluation score.               |
| feedback   | String                       | AI-generated summary feedback.          |
| status     | String                       | in-progress \| evaluating \| completed. |

**9.4 Question**

|                 |                           |                                           |
|-----------------|---------------------------|-------------------------------------------|
| **Field**       | **Type**                  | **Notes**                                 |
| interviewId     | ObjectId (ref: Interview) | Parent interview.                         |
| question        | String                    | Question text.                            |
| expectedAnswer  | String                    | Reference answer/criteria for AI grading. |
| candidateAnswer | String                    | Transcribed candidate response.           |
| category        | String                    | behavioral \| technical \| coding.        |
| score           | Number                    | Per-question score.                       |

**9.5 CodingSubmission**

|           |                         |                                       |
|-----------|-------------------------|---------------------------------------|
| **Field** | **Type**                | **Notes**                             |
| userId    | ObjectId (ref: User)    | Candidate.                            |
| problemId | ObjectId (ref: Problem) | Coding problem attempted.             |
| language  | String                  | Programming language used.            |
| code      | String                  | Submitted source code.                |
| runtime   | Number                  | Execution time (ms).                  |
| score     | Number                  | Test cases passed / evaluation score. |

**10. Core API Endpoints**

|                                |                                                       |
|--------------------------------|-------------------------------------------------------|
| **Method & Route**             | **Description**                                       |
| POST /api/auth/register        | Register a new candidate/recruiter.                   |
| POST /api/auth/login           | Log in and receive access + refresh tokens.           |
| POST /api/auth/refresh         | Rotate an expired access token.                       |
| POST /api/resume/upload        | Upload resume to Cloudinary and trigger parsing.      |
| GET /api/resume/:id            | Fetch parsed resume data.                             |
| POST /api/interview/generate   | Generate a new AI interview based on role/difficulty. |
| GET /api/interview/:id         | Fetch an interview's questions and status.            |
| POST /api/interview/:id/answer | Submit a transcribed answer for evaluation.           |
| POST /api/coding/submit        | Submit code for sandboxed execution and scoring.      |
| GET /api/dashboard/summary     | Fetch candidate's score history and analytics.        |

**11. Suggested Project Structure**

**11.1 Backend (Node/Express)**

- controllers/ – request handlers per resource (auth, resume, interview, coding)

- routes/ – Express route definitions

- models/ – Mongoose schemas

- services/ – AI integration, resume parsing, scoring logic

- jobs/ & queues/ – BullMQ job processors and queue definitions

- socket/ – Socket.io event handlers

- middlewares/ – auth guard, RBAC, error handler, rate limiter

- validators/ – request payload validation (e.g., Joi/Zod)

- docker/ – sandbox execution configuration

- config/ & utils/ – env config, logger, helpers

**11.2 Frontend (React)**

- src/pages/ – route-level views (Login, Dashboard, Interview, Coding)

- src/components/ – reusable UI components

- src/store/ – Redux Toolkit slices

- src/services/ – React Query hooks / API client

- src/hooks/ – custom hooks (e.g., useSpeechRecognition)

**12. Security Requirements**

- Hash all passwords with bcrypt; never store plaintext.

- Use short-lived JWT access tokens with refresh-token rotation.

- Apply Helmet for secure HTTP headers and configure CORS explicitly.

- Validate and sanitize all inputs to prevent NoSQL injection and XSS.

- Apply CSRF protection if using cookie-based auth.

- Rate-limit authentication and AI-generation endpoints to control abuse and API cost.

- Enforce strict resource/time limits on the Docker code-execution sandbox to prevent abuse.

**13. Deployment Plan**

|                        |                                            |
|------------------------|--------------------------------------------|
| **Component**          | **Platform**                               |
| Frontend (React build) | Vercel                                     |
| Backend API (Express)  | Render or Railway                          |
| Database               | MongoDB Atlas                              |
| Cache / Queue store    | Redis (managed, e.g., Upstash/Redis Cloud) |
| File storage           | Cloudinary                                 |
| Background workers     | BullMQ workers on Render/Railway           |
| AI provider            | Gemini or OpenAI API                       |

**14. Suggested 10-Week Build Roadmap**

A phased plan so each week produces a working, demoable increment rather than one large untested build.

|          |                             |                                                                                |
|----------|-----------------------------|--------------------------------------------------------------------------------|
| **Week** | **Focus**                   | **Deliverable**                                                                |
| 1        | Authentication              | Register/login, JWT + refresh tokens, protected routes, RBAC skeleton.         |
| 2        | Resume Upload               | Cloudinary upload + resume parsing into skills/education/experience.           |
| 3        | AI Interview Generation     | Role/difficulty selection UI; Gemini/OpenAI question generation, stored in DB. |
| 4        | Voice Interview             | Text-to-Speech question playback + Speech-to-Text answer capture.              |
| 5        | Live Coding UI              | Monaco editor integrated; problem display; basic code submission flow.         |
| 6        | AI Evaluation               | Scoring service for answers and code; feedback generation.                     |
| 7        | Dashboard                   | Interview history, score trend chart, per-skill breakdown.                     |
| 8        | Redis / Socket.io / BullMQ  | Move AI calls to background jobs; real-time status updates on the UI.          |
| 9        | Docker Sandbox & Deployment | Isolate code execution in Docker; deploy all services to production.           |
| 10       | Polish                      | Error handling, loading states, responsive design, bug fixes, README/demo.     |

**15. Acceptance Criteria (MVP Definition of Done)**

- A candidate can register, log in, and stay authenticated across a browser session.

- A candidate can upload a resume and see extracted skills reflected in the UI.

- A candidate can generate an interview and receive AI-written questions relevant to their selected role.

- A candidate can complete a voice Q&A round and see it transcribed correctly for common cases.

- A candidate can submit code for at least one coding problem and see pass/fail results.

- A candidate receives a numeric score and readable feedback after finishing an interview.

- A candidate can see this interview appear on their dashboard with the correct score.

**16. Resume / Portfolio Highlights**

Once built, this project demonstrates: AI-generated personalized interviews, real-time voice-based mock interviews, resume parsing, an in-browser coding environment with sandboxed execution, an analytics dashboard, and a scalable, queue-backed architecture — strong talking points for interviews and a solid MERN + AI portfolio piece.