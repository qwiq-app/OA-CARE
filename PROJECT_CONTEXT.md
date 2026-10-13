# 🦴 OA Care — Full Project Context Document

> **Last updated:** May 2026  
> **Project path:** `c:\Users\mohdm\OneDrive\Desktop\osteoarthritis\`

---

## 1. What This Project Is

A full-stack **Osteoarthritis Patient Counselling Platform** for elderly patients managing hip and/or knee OA. It covers:

- Public educational content (OA info, symptoms, diagnosis, treatments, exercises, FAQ, resources)
- Patient accounts with exercise logging and a pain diary
- Admin panel for managing users and exercises
- Accessibility-first design (large fonts, large tap targets, high contrast mode)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI (Python 3.11+) |
| **Database** | PostgreSQL 16+ via SQLAlchemy ORM |
| **Auth** | JWT — `python-jose`, `passlib[bcrypt]` |
| **Frontend** | React 18 + Vite |
| **Styling** | TailwindCSS 3 |
| **Icons** | lucide-react |
| **Charts** | Recharts |
| **Video** | react-player |
| **HTTP client** | axios |
| **Image hosting** | Cloudinary (optional) |

---

## 3. Folder Structure

```
osteoarthritis/
├── README.md
├── PROJECT_CONTEXT.md               ← this file
├── backend/
│   ├── .env
│   ├── requirements.txt
│   └── app/
│       ├── main.py                  ← FastAPI app, CORS, routers
│       ├── config.py                ← pydantic-settings
│       ├── database.py              ← engine, SessionLocal, get_db()
│       ├── models/
│       │   ├── __init__.py          ← exports all 4 ORM models
│       │   └── models.py            ← User, Exercise, ExerciseLog, PainDiary
│       ├── routers/
│       │   ├── __init__.py
│       │   ├── auth.py              ← register, login
│       │   ├── users.py             ← /api/users/me
│       │   ├── exercises.py         ← full CRUD + 20 seeded exercises
│       │   ├── progress.py          ← exercise logs + pain diary
│       │   └── admin.py             ← stats, user mgmt, seed
│       ├── schemas/
│       │   └── __init__.py
│       └── utils/
│           ├── __init__.py
│           └── security.py          ← JWT, hash_password, get_current_user, require_admin
│
└── frontend/
    ├── .env                         ← VITE_API_URL=http://localhost:8000
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── index.css                ← Tailwind + .card, .page-container, .section-title
        ├── App.jsx                  ← All routes, ProtectedRoute, Shell
        ├── context/
        │   └── AuthContext.jsx      ← AuthProvider, useAuth()
        ├── services/
        │   └── api.js               ← axios instance + 5 named API exports
        ├── components/
        │   ├── Navbar.jsx           ← sticky, accessibility bar, dropdown
        │   ├── Footer.jsx           ← dark navy, 5 links, disclaimer
        │   └── AdminSidebar.jsx
        └── pages/
            ├── Home.jsx
            ├── AboutOA.jsx
            ├── Symptoms.jsx
            ├── Diagnosis.jsx
            ├── Counselling.jsx
            ├── PharmaMgmt.jsx
            ├── NonPharma.jsx        ← physio, exercise, heat/cold, weight, diet, TENS, devices
            ├── Exercises.jsx
            ├── ExerciseDetail.jsx
            ├── FAQ.jsx              ← search + accordion, 13 Q&As
            ├── Resources.jsx        ← PDF, links, videos, emergency, contact
            ├── Login.jsx
            ├── Register.jsx
            ├── PatientDashboard.jsx
            ├── NotFound.jsx         ← 404 catch-all
            ├── PagePlaceholder.jsx
            └── admin/
                ├── AdminLogin.jsx
                ├── AdminDashboard.jsx
                ├── AdminUsers.jsx
                └── AdminExercises.jsx
```

---

## 4. Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | auto |
| full_name | String | required |
| email | String | unique, indexed |
| phone | String | optional |
| password_hash | String | bcrypt |
| age | Integer | optional |
| gender | String | optional |
| weight_kg | Float | optional |
| height_cm | Float | optional |
| oa_location | String | knee/hip/both |
| oa_grade | Integer | 1–4 (check constraint) |
| comorbidities | String[] | ARRAY |
| role | String | patient / admin |
| is_active | Boolean | default true |
| created_at | DateTime | server default |
| last_login | DateTime | nullable |

### `exercises`
| Column | Type |
|--------|------|
| id | UUID PK |
| name | String |
| category | String (knee/hip) |
| level | String |
| target_area | String |
| description | Text |
| instructions | Text[] |
| sets, reps, hold_seconds | Integer |
| precautions | Text |
| video_url, thumbnail_url | String |
| is_active | Boolean |
| sort_order | Integer |

### `exercise_logs`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK→users | CASCADE delete |
| exercise_id | UUID FK→exercises | |
| completed_at | DateTime | |
| sets_done, reps_done | Integer | |
| pain_before, pain_after | Integer | 0–10 check |
| notes | Text | |

### `pain_diary`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK→users | CASCADE delete |
| recorded_at | DateTime | |
| pain_score | Integer | 0–10 check |
| stiffness_score | Integer | 0–10 check |
| location | String | |
| notes | Text | |

---

## 5. All API Endpoints

### Auth `/api/auth`
| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/auth/register` | Returns token |
| POST | `/api/auth/login` | Returns token |

### Users `/api/users`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/users/me` | Patient token |
| PUT | `/api/users/me` | Patient token |

### Exercises `/api/exercises`
| Method | Path | Auth |
|--------|------|------|
| GET | `/api/exercises/` | Public |
| GET | `/api/exercises/{id}` | Public |
| POST | `/api/exercises/` | Admin |
| PUT | `/api/exercises/{id}` | Admin |
| DELETE | `/api/exercises/{id}` | Admin |

### Progress `/api/progress`
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/progress/log` | Patient |
| GET | `/api/progress/logs` | Patient |
| GET | `/api/progress/summary` | Patient |
| POST | `/api/progress/pain` | Patient |
| GET | `/api/progress/pain` | Patient |

### Admin `/api/admin`
| Method | Path |
|--------|------|
| GET | `/api/admin/stats` |
| GET | `/api/admin/users` |
| GET | `/api/admin/users/{id}/activity` |
| PATCH | `/api/admin/users/{id}/toggle-active` |
| GET | `/api/admin/exercises` |
| POST | `/api/admin/seed-exercises` |

---

## 6. Frontend API Service (`api.js`)

```js
authAPI      → register(data), login(data)
exercisesAPI → getAll(params), getOne(id), create(data), update(id,data), delete(id)
progressAPI  → logExercise(data), getLogs(days), getSummary(),
               logPain(data), getPainDiary(days)
userAPI      → getProfile(), updateProfile(data)
adminAPI     → getStats(), getUsers(params), getUserActivity(id),
               getExercises(params), toggleUserActive(id), seedExercises()
```

- Auto-attaches `Bearer` token from `localStorage` on every request  
- On 401 response: clears storage → redirects to `/login`

---

## 7. All Routes (`App.jsx`)

### Public
| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | AboutOA |
| `/symptoms` | Symptoms |
| `/diagnosis` | Diagnosis |
| `/counselling` | Counselling |
| `/pharmacological` | PharmaMgmt |
| `/non-pharmacological` | NonPharma |
| `/exercises` | Exercises |
| `/exercises/:id` | ExerciseDetail |
| `/faq` | FAQ |
| `/resources` | Resources |
| `/login` | Login |
| `/register` | Register |
| `*` | NotFound |

### Protected
| Route | Component | Guard |
|-------|-----------|-------|
| `/dashboard` | PatientDashboard | logged in |
| `/admin` | AdminDashboard | admin role |
| `/admin/users` | AdminUsers | admin role |
| `/admin/exercises` | AdminExercises | admin role |
| `/admin/login` | AdminLogin | public |

`Shell` hides Navbar automatically on `/admin/*` routes.

---

## 8. Auth Flow

1. Register/Login → JWT returned → stored in `localStorage` (`oa_token`, `oa_user`)
2. `AuthContext` reads on mount → exposes `{ user, token, login, logout }`
3. `useAuth()` consumed by any component needing auth state
4. `ProtectedRoute` guards dashboard and admin routes
5. Logout → clears localStorage → redirects to `/login`

---

## 9. Frontend Conventions

| Rule | Detail |
|------|--------|
| Styling | TailwindCSS only |
| Icons | `lucide-react` only |
| Font size | min `text-lg` (18px+) |
| Tap targets | `min-h-12` (48px+) on all buttons |
| Auth | always `useAuth()` |
| API calls | always named exports from `services/api.js` |
| Navbar | global via `Shell` — never imported per-page |
| Footer | imported in each public page |
| Disclaimer | amber `⚠️` box at bottom of every content page |
| Page hero | `bg-gradient-to-br from-secondary via-white to-white` |
| Cards | `.card` Tailwind utility |
| Section titles | `.section-title` Tailwind utility |
| Page sections | `.page-container` Tailwind utility |

---

## 10. Pages Built in This Session

### `NonPharma.jsx`
8 sections: Physiotherapy info + goal tiles · Exercise Therapy + 40% stat box + library CTA · Heat vs Cold (orange/blue split cards) · Weight Management (1kg→4kg fact + BMI table + 3 tips) · Anti-inflammatory foods 3×2 grid + Foods to Limit · TENS Therapy explanation + info tiles · Assistive Devices (cane, brace, footwear) · Disclaimer

### `FAQ.jsx`
Real-time search bar · Single-open accordion · 13 Q&As with numbered badges · Smooth `max-h` CSS transitions · `aria-expanded` / `aria-controls` / `role="region"` · Empty state with "clear search" link · `aria-live` result count · CTA block linking to Counselling + Exercises

### `Resources.jsx`
PDF download card (blue gradient, `FileText` icon) · 4 external links (Arthritis Foundation, WHO, IRA, IPC) all `target="_blank" rel="noopener noreferrer"` · 3 video placeholder cards with `Play` icon · Red emergency box with `AlertTriangle` · Contact card with `mailto:` link

### `NotFound.jsx`
Gradient 404 number · bone emoji · "Page Not Found" h1 · "Go Back Home" `<Link>` with `Home` lucide icon

### `Footer.jsx` (replaced minimal version)
Dark navy `bg-slate-900` · brand + 5 nav links · dynamic copyright year · medical disclaimer

---

## 11. Python Dependencies

```
fastapi, uvicorn[standard], sqlalchemy, alembic, psycopg2-binary,
python-jose[cryptography], passlib[bcrypt], python-dotenv,
pydantic[email], pydantic-settings, python-multipart, cloudinary, httpx
```

---

## 12. Frontend npm Dependencies

```json
"axios", "lucide-react", "react", "react-dom", "react-player",
"react-router-dom", "recharts", "@tanstack/react-query"

devDependencies:
"@vitejs/plugin-react", "autoprefixer", "postcss", "tailwindcss", "vite"
```

---

## 13. Environment Variables

### `backend/.env`
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

### `frontend/.env`
```env
VITE_API_URL=http://localhost:8000
```

---

## 14. How to Run

### Backend (PowerShell on Windows)
```powershell
cd osteoarthritis\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
# If blocked: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
pip install -r requirements.txt
# Edit .env — set PostgreSQL password
# In psql: CREATE DATABASE oa_platform;
uvicorn app.main:app --reload --port 8000
```

### Frontend
```powershell
cd osteoarthritis\frontend
npm install
npm run dev
```

### Service URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |

---

## 15. First-Time Admin Setup

1. Start backend → go to http://localhost:8000/docs
2. `POST /api/auth/register` — create your account
3. In psql: `UPDATE users SET role='admin' WHERE email='your@email.com';`
4. `POST /api/admin/seed-exercises` (with admin token) → loads 20 exercises

---

## 16. Notes

- `PagePlaceholder.jsx` can be deleted once all pages are confirmed working
- Cloudinary in `.env` is optional — video URLs can be any string
- `ACCESS_TOKEN_EXPIRE_MINUTES=10080` = 7 days (good for elderly users)
- All 20 exercises (12 knee + 8 hip) are seeded via the admin endpoint
- `alembic` in requirements but not yet configured — schema handled by `create_all()` on startup
