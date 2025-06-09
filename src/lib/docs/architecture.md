# 🧠 BigStepLabs Architecture Overview

## Version: v0.3.0-alpha

_Last updated: June 2025_

---

## 1. 🧱 Tech Stack

- **Framework:** SvelteKit
- **UI:** SHADCN UI (with Tailwind + Radix primitives)
- **Styling:** Tailwind CSS + Typography plugin
- **Auth:** Supabase (magic link)
- **Database:** Postgres (via Supabase)
- **AI:** OpenAI, Gemini, and LLMs (via dynamic model profiles)
- **Persistence:** Local JSON (for agents, personas, datasets)
- **Indexing:** Cursor with `.cursorrules` and Docs integration

---

## 2. 📁 Project Folder Structure (Simplified)

````plaintext
src/
├─ routes/
│  ├─ assistant/        → Chat modules
│  ├─ agents/           → Agent creation and listing
│  ├─ datasets/         → Dataset manager (upload, view)
│  ├─ personas/         → Persona listing and editing
│  ├─ documentation/    → Static docs (with mdsvex)
│  ├─ release-notes/    → Version changelogs (markdown)
│  ├─ workbench/        → Agent task runner UI
│  ├─ api/chat/         → Chat server functions
│  └─ settings, login   → UI routing
├─ lib/
│  ├─ components/       → SHADCN-based shared components
│  ├─ docs/             → `architecture.md`, `overview.md`
│  ├─ stores/           → Global state (models, history, etc.)
│  ├─ hooks/            → `is-mobile`, platform utilities
│  └─ server/           → LLM logic, Supabase client
├─ static/              → Assets, SHADCN image, favicon
├─ data/
│  ├─ agents/           → JSON config per agent
│  ├─ personas/         → System prompts, tones, use cases
│  ├─ model-profiles/   → Model + provider bindings
│  └─ datasets/         → Metadata + uploaded files

## 3. 🤖 Agent Structure

Agents are defined as modular configurations composed of:

| Field          | Description                                        |
|----------------|----------------------------------------------------|
| `name`         | Display name for the agent                         |
| `description`  | Agent purpose or task summary                      |
| `model_profile`| ID of linked model profile (e.g., GPT-4, Gemini)   |
| `persona`      | ID of system prompt/persona                        |
| `datasets`     | List of dataset IDs to use                         |
| `tools`        | Features like glossary, TMX, RAG                   |
| `output_format`| Format: Markdown, plain text, JSON                 |

📝 **Defined in:** `/data/agents/[id].json`

---

## 4. 📦 Datasets

Each dataset consists of:

- `slug` (ID)
- `type`: `corpus`, `glossary`, or `tmx`
- `linked_agents`: array of agent IDs
- `file`: original `.csv`, `.tmx`, or `.txt`

📝 **Metadata file:** `/data/datasets/[slug].json`
🗃 **Upload modal:** `UploadDatasetModal.svelte`

---

## 5. 🧍 Personas

A persona includes:

- `name`
- `tone`: formal, casual, etc.
- `use_case`: support, marketing, writing, etc.
- `system_prompt`: full LLM system message

📝 **Stored in:** `/data/personas/[id].json`

---

## 6. 🔧 Model Profiles

Model profile structure:

| Field       | Description                          |
|-------------|--------------------------------------|
| `name`      | e.g., GPT-4o, Gemini Pro             |
| `provider`  | `openai`, `google`, `deepseek`       |
| `prompt`    | Default system prompt override       |

📝 **Defined in:** `/data/model-profiles/[id].json`

---

## 7. 📐 SHADCN UI Usage

UI is built using SHADCN-based components and custom modal dialogs:

- Reusable dialogs: `CreateAgentModal.svelte`, `UploadDatasetModal.svelte`
- Shared primitives: `/lib/components/ui/*`
- Dashboards: `DatasetsDashboard.svelte`, `PersonasDashboard.svelte`

All markdown content is rendered using:

```svelte
<CardContent class="prose">
  {@html content}
</CardContent>

## 8. 🧪 Workbench Module

The `/workbench` module allows selecting a **task** and an **agent** to run structured operations.

### Planned Tasks:
- Translate CSV
- Glossary QA
- Release Note Generator

🧠 *Note:* Execution logic is **not yet implemented** — current state is a functional UI **stub**.

---

## 9. 🧠 Chat & Assistant Logic

The `/assistant` module supports:

- Chatting with custom agents
- Using selected **model**, **persona**, and **datasets**
- Persisting chat history (client-side)
- *(Planned)* Storing sessions in Supabase:
  - `chat_sessions` table
  - `messages` table

---

## 10. 🛡️ Auth & Supabase

- Supabase manages authentication via **magic link login**
- All user-specific tables (e.g., `models`, `api_keys`, `messages`) include a `user_id` field
- **Row Level Security (RLS)** is enforced with:

```sql
policy: user_id = auth.uid()
JWT is automatically passed through the client session

## 11. 🗂 Cursor AI Integration

- `.cursorrules` and `.cursorignore` are present in the project root
- **Codebase indexing is enabled**
- Static Markdown pages such as:
  - `release-notes.md`
  - `documentation.md`
  use **mdsvex** for rendering
- `architecture.md` is registered as an **AI-readable document** for internal context


````
