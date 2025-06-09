# 📦 CHANGELOG

## v0.3.0-alpha – Foundation Complete (June 6, 2025)

### 🔐 Authentication & User Management

- Magic link login via Supabase Auth with email whitelist
- Multi-user support via `user_id` and RLS (Row Level Security)
- Real-time user info in sidebar/footer (name, email, avatar)
- Logout flow with session cleanup

### 🧠 Database & Schema (Supabase)

Postgres schema with:

- `models`, `api_keys`, `chat_sessions`, `messages`
- Foreign key constraints and user-scoped data enforcement
- RLS policies tested with JWT-based access control

### 🧩 App Modules (SvelteKit + SHADCN UI)

- Sidebar navigation: Assistant, History, Settings, Agents, Model Profiles, Datasets, Personas, Workbench, Documentation
- SHADCN components for Cards, Tables, Buttons, Modals
- Fully responsive layout with modern UI patterns

### 🔧 Feature Highlights

- Assistant chat interface using selected model profile
- CRUD for:
  - Model Profiles (name, provider, prompt)
  - API Keys (per provider)
  - Agents (description, model, persona, datasets, tools)
  - Datasets (upload, link, metadata)
  - Personas (tone, use case, system prompt)
- Workbench shell for structured tasks (task/agent selector)

### 🛠 Developer Experience

- Modular SvelteKit structure with clean code separation
- Global state management using Svelte stores
- Supabase CLI + schema tracking
- File-based config system (for local agent/dataset simulation)
- Stable routes and protected user scopes

### 📈 Roadmap / Next Steps

- Wire Assistant chat to full Agent configs (model, persona, dataset)
- Enable Workbench task runners (Translate CSV, QA Glossary, Rewrite Text)
- Connect Agent config to RAG/retrieval logic
- Add user profile editing (name, avatar)
- Integrate advanced documentation (searchable, interactive)
- Improve mobile responsiveness

### 🧪 Known Lessons & Debug Notes

- RLS requires valid JWT via Supabase client — `auth.uid()` is null without it
- Debug access issues using the SQL editor (service role vs user session)
- Avoid permissive policies (`USING (true)`) in production
