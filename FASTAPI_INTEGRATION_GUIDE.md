# NumLab FastAPI Integration Guide

This guide explains how to connect the current NumLab React + TypeScript frontend to a FastAPI backend in a clean, production-friendly way.

It is written as an implementation tutorial, not just a checklist. The goal is to help you move from the current mock-data frontend to a real full-stack app without breaking the polished user experience you already have.

---

## 1. What You Have Today

The frontend is already in a good place:

- A React + TypeScript + Vite app
- Route-based pages for:
  - public landing
  - authentication
  - dashboard
  - module detail pages
  - analytics
  - quiz
  - admin
- A polished visual system with:
  - brand styling
  - responsive layout
  - 3D hero scene
  - charts
  - cards and dashboards

Right now, much of the app is powered by:

- local mock data
- local UI state
- placeholder auth logic

That means the frontend already looks and feels like a product, but it is not yet backed by a real API.

FastAPI is a great fit here because it gives you:

- fast JSON APIs
- automatic OpenAPI docs
- clean Python typing
- easy authentication patterns
- a strong path to future database integration

---

## 2. The Integration Goal

The goal is to make the frontend talk to FastAPI for:

- authentication
- users
- modules
- progress tracking
- quizzes
- analytics
- admin operations

You want the frontend to stop pretending data is real and instead load everything from backend endpoints.

That means:

- login should call `/auth/login`
- dashboard stats should call `/dashboard/summary`
- module pages should call `/modules`
- quiz pages should call `/quizzes/:id`
- submit quiz should call `/quizzes/:id/submit`
- analytics should call `/analytics/overview`

Eventually, the UI should feel like a serious learning platform, not just a static showcase.

---

## 3. Recommended Architecture

The best structure is:

- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy or SQLModel
- Validation: Pydantic
- Auth: JWT or cookie-based session auth
- File storage: local storage at first, later S3-compatible storage if needed

### Suggested folder layout

```text
my-app/
  frontend/
  backend/
```

Or, if you want to keep a single repo:

```text
my-app/
  src/
  backend/
```

For this project, a single repo is fine at the start.

### Why this architecture works

- FastAPI handles the data and business logic
- React handles the UI and user experience
- The API stays versioned and testable
- The frontend can evolve independently from the backend

---

## 4. What to Build First

Do not try to connect everything at once.

The best order is:

1. Backend foundation
2. Authentication
3. Module listing and detail pages
4. Dashboard summary
5. Quiz flow
6. Analytics
7. Admin tools
8. Notifications and advanced features

This order matters because auth and shared data models support almost everything else.

---

## 5. FastAPI Backend Setup

### 5.1 Create the backend environment

In a new `backend` folder:

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn[standard] pydantic sqlalchemy psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart
```

Optional but recommended:

```bash
pip install alembic httpx pytest pytest-asyncio
```

### 5.2 Minimal backend structure

```text
backend/
  app/
    main.py
    core/
      config.py
      security.py
    db/
      session.py
      base.py
    models/
      user.py
      module.py
      quiz.py
      progress.py
    schemas/
      auth.py
      user.py
      module.py
      quiz.py
      analytics.py
    api/
      routes/
        auth.py
        users.py
        modules.py
        quizzes.py
        analytics.py
        admin.py
```

This separation keeps the code maintainable.

---

## 6. Backend Starter Code

### 6.1 `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, users, modules, quizzes, analytics, admin

app = FastAPI(title="NumLab API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(modules.router, prefix="/modules", tags=["modules"])
app.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/health")
def health():
    return {"status": "ok"}
```

### 6.2 Why CORS matters

Your frontend runs on Vite, likely on `localhost:5173`.

Your backend will run on a different port, such as `8000`.

Browsers block cross-origin requests unless FastAPI explicitly allows them.

That is why CORS middleware is required.

---

## 7. Authentication Design

Authentication is one of the most important parts of the integration.

You need to decide between:

1. JWT in local storage
2. JWT in httpOnly cookies
3. Session-based auth

### Recommended option

Use:

- access token in httpOnly cookie
- refresh token if needed later

Why:

- safer than local storage
- easier to protect against token theft
- cleaner for real production use

If you want to keep the first version simpler, JWT bearer tokens in memory is acceptable for development. But for long-term quality, cookies are better.

### Auth endpoints

You should implement:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

### Example request/response

#### Login request

```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

#### Login response

```json
{
  "user": {
    "id": "usr_123",
    "name": "Zaineb Messaoudi",
    "email": "student@example.com",
    "role": "student"
  },
  "accessToken": "eyJhbGciOi..."
}
```

### Auth rules

- if user is not logged in, redirect to `/login`
- if logged in user is a student, block `/admin`
- if role is admin, show admin dashboard
- if email is not verified, show verification screen

---

## 8. Database Model Plan

You will eventually want real tables for:

- users
- modules
- lessons
- quizzes
- questions
- answers
- attempts
- progress
- bookmarks
- achievements
- notifications
- admin logs

### Suggested core tables

#### `users`
- id
- name
- email
- hashed_password
- role
- is_verified
- created_at

#### `modules`
- id
- slug
- title
- description
- difficulty
- order_index
- is_published

#### `quiz_attempts`
- id
- user_id
- quiz_id
- score
- total
- submitted_at
- duration_seconds

#### `progress`
- id
- user_id
- module_id
- progress_percent
- last_opened_at

### Important design rule

Keep learning content separate from user progress.

That lets you update module text without damaging student history.

---

## 9. API Design for the Frontend

This is where the project becomes real.

You want the frontend to call the backend instead of using `mock-data.ts`.

### 9.1 Dashboard summary

Endpoint:

```http
GET /dashboard/summary
```

Response:

```json
{
  "currentStreak": 12,
  "averageQuiz": 84,
  "learningHours": 23.5,
  "completedModules": 6,
  "totalModules": 18,
  "recentActivity": [
    {
      "id": "act_1",
      "title": "Completed Simpson's Rule",
      "detail": "Scored 8/10 on numerical integration quiz",
      "when": "2 hours ago"
    }
  ]
}
```

### 9.2 Modules list

Endpoint:

```http
GET /modules
```

Response:

```json
[
  {
    "id": "mod_1",
    "slug": "root-finding",
    "title": "Root Finding",
    "description": "Learn bisection, Newton-Raphson, and the secant method.",
    "difficulty": "Intermediate",
    "chapters": 8,
    "hours": 4,
    "progress": 42
  }
]
```

### 9.3 Module detail

Endpoint:

```http
GET /modules/{slug}
```

Response:

```json
{
  "id": "mod_1",
  "slug": "root-finding",
  "title": "Root Finding",
  "description": "Learn bisection, Newton-Raphson, and the secant method.",
  "sections": [
    "Introduction",
    "Theory",
    "Examples",
    "Quiz"
  ],
  "difficulty": "Intermediate",
  "chapters": 8,
  "hours": 4,
  "progress": 42
}
```

### 9.4 Quiz fetch

Endpoint:

```http
GET /quizzes/{quizId}
```

Response:

```json
{
  "id": "quiz_1",
  "title": "Numerical Integration Practice",
  "timeLimitSeconds": 720,
  "questions": [
    {
      "id": "q1",
      "prompt": "Which method repeatedly brackets a root?",
      "options": [
        "Newton-Raphson",
        "Secant method",
        "Bisection method",
        "LU decomposition"
      ]
    }
  ]
}
```

### 9.5 Quiz submit

Endpoint:

```http
POST /quizzes/{quizId}/submit
```

Request:

```json
{
  "answers": {
    "q1": 2,
    "q2": 1,
    "q3": 0
  },
  "durationSeconds": 318
}
```

Response:

```json
{
  "score": 8,
  "total": 10,
  "percent": 80,
  "feedback": [
    {
      "questionId": "q1",
      "correct": true,
      "explanation": "Bisection guarantees convergence..."
    }
  ]
}
```

### 9.6 Analytics

Endpoint:

```http
GET /analytics/overview
```

Response could include:

- weekly hours
- completion trend
- quiz averages
- streaks
- badges
- module mastery

---

## 10. Frontend Data Flow

Right now the frontend uses static mock data from local files.

You should replace that gradually.

### Recommended migration path

#### Step 1
Create a simple API client:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
```

#### Step 2
Create helper functions:

```ts
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}
```

#### Step 3
Replace one page at a time.

Do not try to replace every page in one huge refactor.

### Good order for frontend migration

1. dashboard summary
2. modules list
3. module detail
4. quiz page
5. analytics page
6. admin page
7. auth flows

---

## 11. Suggested Frontend API Layer

Create a file like:

```text
src/lib/api.ts
```

Example:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type RequestOptions = RequestInit & {
  json?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

This gives you one consistent way to call the backend.

---

## 12. State Management Strategy

You have a few options.

### Option A: simple fetch calls

Best for early development.

Use:

- `useEffect`
- `useState`

Pros:

- simple
- low dependency count

Cons:

- more manual loading/error handling
- harder to cache and refetch

### Option B: SWR

Good for dashboard-style apps.

Pros:

- caching
- revalidation
- easy loading states

### Option C: TanStack Query

Best for a real production-like app.

Pros:

- strong caching
- mutation handling
- optimistic updates
- invalidation

### Recommendation

Use TanStack Query if you want the cleanest long-term architecture.

Use fetch-only if you want the lightest possible setup.

---

## 13. How to Connect Auth in the Frontend

### Login flow

1. user enters email and password
2. frontend sends request to `/auth/login`
3. backend validates credentials
4. backend returns user data and token or sets a cookie
5. frontend stores session state
6. user is redirected to `/dashboard`

### Logout flow

1. frontend calls `/auth/logout`
2. backend clears cookie or invalidates session
3. frontend clears auth state
4. user is redirected to landing page

### Protected routes

Your route guard should:

- check whether a user exists
- verify role if needed
- redirect to login if unauthenticated
- redirect to dashboard if already logged in and trying to access auth pages

---

## 14. How to Connect the Quiz Page

The quiz page is one of the best places to make the backend feel real.

### Frontend quiz flow

1. load quiz data from backend
2. display timed questions
3. track selected answers locally while the user is taking the quiz
4. submit answers to backend
5. receive score and detailed feedback
6. show results and update user progress

### Why submit to backend

If scoring happens only in the browser:

- it can be manipulated
- results are not stored
- analytics cannot track progress properly

By sending results to FastAPI:

- scores are saved
- analytics are real
- student mastery can be tracked

### Better quiz result structure

Return:

- score
- total
- percent
- per-question correctness
- explanations
- next recommended module
- mastery level

---

## 15. Analytics Integration

Analytics should not just be charts for decoration.

They should answer:

- what the student has completed
- where they struggle
- how consistently they study
- which topics need review

### Useful analytics endpoints

- `GET /analytics/summary`
- `GET /analytics/weekly`
- `GET /analytics/achievements`
- `GET /analytics/mastery`

### Example analytics data

```json
{
  "streak": 12,
  "averageQuiz": 84,
  "hoursThisWeek": 6.5,
  "masteryByTopic": [
    { "topic": "Root Finding", "value": 78 },
    { "topic": "Integration", "value": 91 }
  ],
  "achievements": [
    {
      "title": "Consistent Learner",
      "description": "Studied 5 days in a row"
    }
  ]
}
```

---

## 16. Admin Dashboard Integration

The admin area should be a real management surface.

### Admin capabilities

- view users
- edit roles
- create or edit modules
- publish/unpublish lessons
- review quiz activity
- inspect platform stats
- moderate content

### Suggested endpoints

- `GET /admin/users`
- `GET /admin/modules`
- `POST /admin/modules`
- `PATCH /admin/modules/{id}`
- `DELETE /admin/modules/{id}`
- `GET /admin/stats`
- `GET /admin/audit-log`

### Admin safety rules

- only admins can access these routes
- every destructive action should require confirmation
- log important actions

---

## 17. Environment Variables

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend `.env`

```env
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/numlab
JWT_SECRET=super-secret-key
JWT_ALGORITHM=HS256
FRONTEND_URL=http://localhost:5173
```

### Important note

Do not hardcode secrets in the repo.

Use environment variables for anything sensitive.

---

## 18. File-by-File Frontend Migration Plan

### Step 1: create API helpers

Add:

- `src/lib/api.ts`
- `src/lib/auth-api.ts`
- `src/lib/module-api.ts`
- `src/lib/quiz-api.ts`
- `src/lib/analytics-api.ts`

### Step 2: replace mock auth

Update:

- login page
- register page
- forgot password page
- reset password page
- verify email page

### Step 3: replace dashboard data

Update:

- `src/routes/dashboard.index.tsx`
- `src/routes/dashboard.modules.tsx`
- `src/routes/dashboard.analytics.tsx`

### Step 4: replace quiz data

Update:

- `src/routes/dashboard.quiz.tsx`

### Step 5: replace module detail data

Update:

- `src/routes/dashboard.modules.$slug.tsx`

### Step 6: replace admin placeholders

Update:

- `src/routes/admin.tsx`

---

## 19. Loading and Error States

This is one of the most important parts of making the app feel professional.

### Always handle these states

- loading
- error
- empty
- success

### Example

If no modules are returned:

```tsx
if (!modules.length) {
  return <EmptyState title="No modules yet" description="Create your first module to get started." />;
}
```

### Why this matters

A polished app does not just look pretty when data exists.

It also feels trustworthy when:

- the network is slow
- the user is offline
- the response is empty
- the backend errors

---

## 20. Accessibility Checklist

When connecting to FastAPI, do not lose the accessibility work already added.

### Required accessibility practices

- all buttons must remain real `<button>` elements
- all links must remain real `<a>` or router links
- provide labels for inputs
- maintain visible focus rings
- keep heading order logical
- ensure sufficient color contrast
- keep reduced motion support
- announce important changes with `aria-live`

### Quiz-specific accessibility

- timer should be readable by screen readers
- selected option should be clear without color alone
- result state should be announced after submission
- buttons should be reachable by keyboard

### Chart accessibility

Charts need text alternatives or summaries.

Do not assume a chart alone is enough.

Add:

- visible summary text
- key numbers
- accessible table fallback if needed

---

## 21. Performance Checklist

When the backend is connected, performance should still stay strong.

### Frontend performance

- keep route-level lazy loading
- load heavy charts only where needed
- keep the 3D scene lightweight
- avoid unnecessary rerenders
- use memoization only where it actually helps

### Backend performance

- index common query fields
- paginate long lists
- cache repeated analytics queries if needed
- avoid overfetching large payloads

### Database performance

- use proper foreign keys
- avoid storing duplicate derived data unless needed
- aggregate analytics in backend queries or cached views

---

## 22. Testing Strategy

Do not rely only on manual clicking.

### Frontend tests

- route rendering
- auth guard behavior
- quiz scoring states
- responsive layout checks
- accessibility checks

### Backend tests

- auth endpoints
- module endpoints
- quiz submission
- analytics endpoints
- admin authorization

### Recommended tools

- Frontend: Vitest + Testing Library
- Backend: Pytest + HTTPX

---

## 23. Deployment Strategy

You can deploy in a simple split setup:

- frontend on Vercel, Netlify, or similar
- backend on Render, Railway, Fly.io, or a VPS
- database on managed PostgreSQL

### Deployment steps

1. deploy backend
2. set backend environment variables
3. deploy frontend
4. set `VITE_API_BASE_URL`
5. verify CORS
6. test login and dashboard data

### Production checklist

- secure secrets
- HTTPS enabled
- correct CORS origins
- rate limiting
- logging enabled
- error monitoring

---

## 24. Suggested Implementation Order

If you want the cleanest path, do this:

### Phase 1

- create backend
- add auth endpoints
- add health check

### Phase 2

- connect login and register
- protect dashboard routes

### Phase 3

- connect modules and module detail pages
- move module content into backend

### Phase 4

- connect quiz fetching and submission
- store quiz attempts

### Phase 5

- connect analytics
- calculate learning streaks and mastery

### Phase 6

- connect admin dashboard
- add editing and moderation

---

## 25. Common Mistakes to Avoid

- trying to connect every page at once
- keeping mock data forever
- hardcoding API URLs everywhere
- storing sensitive tokens in local storage without a reason
- forgetting CORS
- forgetting loading/error states
- letting auth and role checks live only in the UI
- building admin routes without server-side permission checks

---

## 26. Final Recommended Stack

If I were building NumLab seriously, I would use:

- React
- TypeScript
- Vite
- FastAPI
- PostgreSQL
- SQLAlchemy or SQLModel
- Pydantic
- JWT auth with httpOnly cookies
- TanStack Query
- Tailwind CSS
- Recharts
- React Three Fiber

That stack gives you:

- a strong developer experience
- clean separation of frontend and backend
- room for growth
- good performance
- professional maintainability

---

## 27. Short Version of the Plan

If you want the shortest practical summary:

1. Create a FastAPI backend
2. Define auth, modules, quiz, analytics, and admin endpoints
3. Add a frontend API client
4. Replace mock data page by page
5. Store quiz results and progress in the database
6. Add loading, error, accessibility, and performance handling
7. Deploy frontend and backend separately

---

## 28. What Makes This Feel Like a Real Product

The difference between a demo and a product is not just visuals.

It is whether:

- data is real
- auth is secure
- progress persists
- quizzes are stored
- analytics mean something
- admins can manage content
- the app works on mobile
- accessibility is respected
- performance is good on weaker devices

Once FastAPI is connected properly, NumLab can move from a polished frontend concept into a real learning platform.

