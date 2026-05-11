# SentinelOps AI

**Enterprise AI Agent Governance & Security Platform**

SentinelOps AI is a full-stack trust layer for enterprise AI agents — providing real-time prompt-risk detection, policy enforcement, role-based access control, and compliance-grade audit trails.

---

## ✨ Features

- 🛡️ **Prompt Risk Detection** — Detects injection attacks, credential exfiltration, and unsafe commands
- 📋 **Policy Engine** — Regex-based rules with ALLOW / DENY / HUMAN_REVIEW / QUARANTINE / RATE_LIMIT actions
- 👤 **Role-Based Access** — ADMIN, ANALYST, AUDITOR roles with JWT authentication
- 📊 **Governance Dashboard** — Real-time stats on requests, blocks, and risk categories
- 🔍 **Audit Logs** — Immutable, filterable record of every agent action
- 🤖 **Gemini AI Integration** — LLM-powered risk analysis via Google Gemini
- ⚙️ **Workflow Execution** — Full pipeline: receive → inspect → evaluate → execute → log

---

## 🏗️ Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS    |
| Backend  | Node.js, Express, TypeScript            |
| Database | PostgreSQL 16 + Prisma ORM              |
| Cache    | Redis 7                                 |
| AI       | Google Gemini 2.0 Flash                 |
| Deploy   | Docker + Docker Compose                 |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Docker Desktop

### 1. Clone & install
```bash
git clone https://github.com/NodeNexus/SentinelOps.git
cd SentinelOps
npm install
```

### 2. Configure environment
```bash
cp .env.example apps/api/.env
# Edit apps/api/.env and fill in your GEMINI_API_KEY
```

### 3. Start the database
```bash
docker-compose up -d postgres redis
```

### 4. Run migrations & seed
```bash
npm --workspace @sentinelops/api run prisma:generate
npm --workspace @sentinelops/api run prisma:migrate -- --name init
npm --workspace @sentinelops/api run seed
```

### 5. Start dev servers
```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

### Demo credentials
| Role    | Email                      | Password  |
|---------|----------------------------|-----------|
| Admin   | admin@sentinelops.ai       | Demo@123  |
| Analyst | analyst@sentinelops.ai     | Demo@123  |
| Auditor | auditor@sentinelops.ai     | Demo@123  |

---

## 🐳 Production Deployment (Docker Compose)

```bash
cp .env.example .env
# Edit .env — set JWT_SECRET and GEMINI_API_KEY

docker-compose up --build -d
```

Services:
- **Web** → http://localhost:3000
- **API** → http://localhost:4000
- **Postgres** → localhost:5432
- **Redis** → localhost:6379

---

## 📁 Project Structure

```
sentinelops-ai/
├── apps/
│   ├── api/                  # Express API server
│   │   ├── prisma/           # Schema & migrations
│   │   └── src/
│   │       ├── routes/       # auth, workflows, policies, audit, dashboard
│   │       ├── utils/        # AI, detectors, policy engine, auth helpers
│   │       └── middleware/   # JWT auth guard
│   └── web/                  # Next.js 14 App Router frontend
│       ├── app/              # Pages (dashboard, workflows, policies, audit, settings)
│       └── components/       # Nav + shared UI
├── docker-compose.yml
├── .env.example
└── package.json              # npm workspaces root
```

---

## 🔐 API Endpoints

| Method | Path                    | Auth          | Description              |
|--------|-------------------------|---------------|--------------------------|
| POST   | /auth/login             | Public        | Login, returns JWT        |
| POST   | /auth/register          | Public        | Register new user         |
| GET    | /dashboard/stats        | ADMIN/ANALYST | Governance metrics        |
| GET    | /workflows              | Any auth      | List workflows            |
| POST   | /workflows              | Any auth      | Create & run workflow     |
| GET    | /workflows/:id          | Any auth      | Workflow detail + events  |
| GET    | /policies               | Any auth      | List policy rules         |
| POST   | /policies               | ADMIN         | Create policy rule        |
| POST   | /policies/simulate      | Any auth      | Simulate prompt vs rules  |
| GET    | /audit                  | ADMIN/AUDITOR | Audit log (filtered)      |
| GET    | /audit/export           | ADMIN/AUDITOR | Export as CSV             |

---

## 📄 License

MIT © SentinelOps AI
