# Firon Roofing AI Backend: Technical Documentation

## 1. Overview
The Firon AI Backend is a high-performance Python-based service that powers the AI chat widget. It utilizes a **RAG (Retrieval-Augmented Generation)** architecture to provide accurate, brand-specific answers based on scraped knowledge from the Firon Roofing website.

---

## 2. Technical Stack
- **Framework**: FastAPI (Asynchronous Python)
- **AI Orchestration**: LangChain
- **Vector Database**: ChromaDB (High-efficiency semantic search)
- **Embeddings**: OpenAI `text-embedding-3-small`
- **LLM**: OpenAI `gpt-4o-mini` (Low-latency, high-reasoning)

---

## 3. Core Architecture

### 🧠 RAG Pipeline (Knowledge Retrieval)
1. **Data Loading**: On startup, the system loads `firon_knowledge.json` (the result of the web scraping process).
2. **Vectorization**: Documents are converted into high-dimensional vectors and stored in a local ChromaDB instance (`./chroma_db`).
3. **Retrieval**: When a user asks a question, the top 3 most relevant sections from the website are retrieved via semantic similarity search.

### 🤖 Intent Classification
Before responding, the backend performs a specialized classification pass to detect user intent:
- **HIGH_INTENT**: Triggers the "Lead Handoff" (Quote Request form on the frontend).
- **RESEARCHING / FAQ**: Standard RAG response.
- **CASUAL**: Polite small talk response.

---

## 4. API Specification

### POST `/chat`
Generates an AI response based on current knowledge and conversation history.

**Request Body (`ChatRequest`):**
```json
{
  "message": "Do you offer emergency repairs?",
  "history": [
    {"role": "user", "content": "Hi there"},
    {"role": "assistant", "content": "Hello! How can I help?"}
  ]
}
```

**Response Body (`ChatResponse`):**
```json
{
  "answer": "Yes! Firon Roofing offers 24/7 emergency service...",
  "intent": "HIGH_INTENT",
  "handoff_required": true
}
```

### POST `/lead`
Captures user contact information and the conversation transcript.

**Request Body (`LeadRequest`):**
```json
{
  "name": "Kevin J",
  "email": "kevin@example.com",
  "history": [...]
}
```

---

## 5. Setup & Configuration

### Environment Variables (`.env`)
The following keys are required in the `backend/.env` file:
```bash
OPENAI_API_KEY=sk-your-key-here
```

### Running the Server
The server uses Uvicorn for asynchronous execution:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

---

## 6. Key Implementation Details

1. **CORS Middleware**: Pre-configured to allow cross-origin requests from any frontend (`allow_origins=["*"]`), ensuring the widget can be embedded on any domain.
2. **Persistance**: ChromaDB is configured to persist in the `./chroma_db` directory, allowing for fast restarts without re-indexing the entire knowledge base.
3. **Email Integration (Placeholder)**: The `/lead` endpoint currently logs leads to the console for prototyping. It is pre-wired for `smtplib` integration to send automated email alerts to the Firon business team.

---
*Developed for Firon Roofing - Kev's Standard AI agentic services*
