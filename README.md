# 🦴 OA Care — Osteoarthritis Patient Counselling Platform

A full-stack web application for Hip & Knee Osteoarthritis patient education, exercise guidance, and progress tracking — built for elderly users with accessibility-first design.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python 3.11+) + PostgreSQL + SQLAlchemy |
| Frontend | React 18 + Vite + TailwindCSS |
| Auth | JWT tokens (python-jose) |
| Charts | Recharts |
| Icons | lucide-react |
| Image hosting | Cloudinary (optional) |

---

## Project Structure

```
osteoarthritis/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app, CORS, routers
│   │   ├── config.py             # pydantic-settings, .env reader
│   │   ├── database.py           # SQLAlchemy engine, SessionLocal
│   │   ├── models/
│   │   │   └── models.py         # User, Exercise, ExerciseLog, PainDiary
│   │   ├── routers/
│   │   │   ├── auth.py           # POST /api/auth/register & /login
│   │   │   ├── users.py          # GET/PUT /api/users/me
│   │   │   ├── exercises.py      # Full CRUD + 20 seeded exercises
│   │   │   ├── progress.py       # Exercise logs & pain diary
│   │   │   └── admin.py          # Stats, user management, seed
│   │   └── utils/
│   │       └── security.py       # JWT, password hashing, auth deps
│   ├── .env                      # Environment variables (edit before running)
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # All routes with ProtectedRoute
    │   ├── context/
    │   │   └── AuthContext.jsx   # useAuth() hook
    │   ├── services/
    │   │   └── api.js            # All axios API calls
    │   ├── components/
    │   │   ├── Navbar.jsx        # Sticky nav, font size, high contrast
    │   │   └── Footer.jsx        # Dark footer with links
    │   └── pages/
    │       ├── Home.jsx
    │       ├── AboutOA.jsx
    │       ├── Symptoms.jsx
    │       ├── Diagnosis.jsx
    │       ├── Counselling.jsx
    │       ├── PharmaMgmt.jsx
    │       ├── NonPharma.jsx
    │       ├── Exercises.jsx
    │       ├── ExerciseDetail.jsx
    │       ├── FAQ.jsx
    │       ├── Resources.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── PatientDashboard.jsx
    │       ├── NotFound.jsx
    │       └── admin/
    │           ├── AdminLogin.jsx
    │           ├── AdminDashboard.jsx
    │           ├── AdminUsers.jsx
    │           └── AdminExercises.jsx
    ├── .env                      # VITE_API_URL=http://localhost:8000
    └── package.json
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+

---

### Backend Setup

```bash
cd osteoarthritis/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate      # Mac/Linux

# Install dependencies
pip install -r requirements.txt
pip install pydantic-settings
```

**Edit `.env`** — set your PostgreSQL password in `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:YOURPASSWORD@localhost:5432/oa_platform
SECRET_KEY=change-this-to-any-random-string-min-32-chars-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

**Create the database in psql:**

```sql
CREATE DATABASE oa_platform;
```

**Start the backend server:**

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at: **http://localhost:8000/docs**

---

### First-Time Admin Setup

1. Open **http://localhost:8000/docs**
2. `POST /api/auth/register` — create your first user account
3. In psql, promote that user to admin:
   ```sql
   UPDATE users SET role='admin' WHERE email='your@email.com';
   ```
4. Login via Swagger → click **Authorize** → paste the returned token
5. `POST /api/admin/seed-exercises` — loads all 20 OA exercises (12 knee + 8 hip)

---

### Frontend Setup

```bash
cd osteoarthritis/frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## Pages

### Public (no login required)

| Route | Page |
|-------|------|
| `/` | Home — hero, OA overview, exercise preview |
| `/about` | About OA — definition, types, stages, risk factors |
| `/symptoms` | Symptoms — hip vs knee, when to see a doctor |
| `/diagnosis` | Diagnosis — X-ray grades, WOMAC scoring |
| `/counselling` | Counselling — do's/don'ts, daily tips, psychological support |
| `/pharmacological` | Pharmacological Management — medications table |
| `/non-pharmacological` | Non-Pharmacological — physio, exercise, heat/cold, diet, TENS, devices |
| `/exercises` | Exercise Library — filtered grid of all 20 exercises |
| `/exercises/:id` | Exercise Detail — video, steps, log button |
| `/faq` | FAQ — searchable accordion, 13 Q&As |
| `/resources` | Resources — downloads, links, emergency guidance |
| `/login` | Login |
| `/register` | Register — 3-step form |

### Patient (login required)

| Route | Page |
|-------|------|
| `/dashboard` | Patient Dashboard — pain chart, exercise log, stats |

### Admin (admin role required)

| Route | Page |
|-------|------|
| `/admin` | Admin Dashboard — stats, charts |
| `/admin/users` | User Management — patient table + side panel |
| `/admin/exercises` | Exercise Management — CRUD with modal |

---

## Accessibility Features

- **Minimum 18px font size** throughout (elderly users)
- **Minimum 48px tap targets** on all buttons and interactive elements
- **Font size controls** (A- / A+) in the top accessibility bar
- **High contrast mode** toggle
- **ARIA labels** on all navigation and interactive elements
- **Semantic HTML** (`<main>`, `<section>`, `<article>`, `<nav>`)

---

## Default Ports

| Service | URL |
|---------|-----|
| Backend API | http://localhost:8000 |
| Frontend App | http://localhost:5173 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

---

## Medical Disclaimer

> This platform is for educational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider for diagnosis, treatment, or any medical decisions.
