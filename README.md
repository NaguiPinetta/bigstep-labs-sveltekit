# 🧠 BigStep Labs — AI Agent Platform

A modular full-stack platform to manage and run AI agents using **SvelteKit**, **Supabase**, and **SHADCN UI**.

---

## 🚀 Quickstart

Clone the repo and get started locally:

````bash
git clone https://github.com/your-org/bigstep-labs-sveltekit.git
cd bigstep-labs-sveltekit
npm install
npm run dev

Configure your .env file with your Supabase keys and providers (OpenAI, Gemini, etc.).

## 🧱 Tech Stack

| Layer         | Technology                                                 |
|---------------|-------------------------------------------------------------|
| Frontend      | SvelteKit + SHADCN UI                                      |
| Backend       | Supabase (Postgres + Auth)                                 |
| AI Providers  | OpenAI · Gemini · DeepSeek (via API key manager)           |
| Auth          | Supabase Magic Link + Row Level Security (RLS)             |
| State         | Svelte stores + Cursor `.cursorrules`                      |

---

## 📁 Folder Structure (Simplified)

src/
├── lib/
│ ├── components/ → UI, modals, shared SHADCN components
│ ├── docs/ → AI-readable developer docs
│ ├── server/ → Supabase/LLM integration logic
│ └── stores/ → Global Svelte stores (models, user, etc.)
├── routes/
│ ├── agents/ → Agent creation + config UI
│ ├── datasets/ → Upload & link corpora/glossaries
│ ├── personas/ → Define personas & tone
│ ├── workbench/ → Run structured tasks
│ ├── documentation/ → Markdown docs via mdsvex
│ └── release-notes/ → Changelog markdown and UI


---

## 🔧 Features

- Create & manage agents (model + persona + dataset + tools)
- Upload datasets (CSV, TMX, glossary)
- Create personas (tone, use case, prompt)
- Link datasets and tools to agents (e.g. glossary, TMX, RAG)
- Fully responsive SHADCN UI
- Workbench for task execution
- Cursor AI integration with `.cursorrules` and `.md` documentation

---

## 📄 Indexed Docs

These documents are registered with Cursor's **Indexing & Docs** system:

- `src/lib/docs/architecture.md` — platform structure and logic
- `src/routes/release-notes/rn-content.md` — changelog entries
- `README.md` — this file

---

## 💬 Assistant System Logic

- Chat using `/assistant/chat`
- Agents apply: model profile, persona prompt, datasets
- Supabase tables (planned): `chat_sessions`, `messages`
- AI calls handled by `lib/server/llm.ts`

---

## 🔐 Supabase & Security

- Magic Link auth
- RLS enabled on all tables
- Each record scoped with `user_id = auth.uid()`

**Example RLS policy:**

```sql
CREATE POLICY "Users access only their data"
ON models FOR SELECT
USING (user_id = auth.uid());
````
