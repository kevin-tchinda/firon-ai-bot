from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

# from llama_index.core import VectorStoreIndex, Settings
# from llama_index.embeddings.openai import OpenAIEmbedding
# from llama_index.llms.openai import OpenAI
# from llama_index.vector_stores.chroma import ChromaVectorStore
# import chromadb

# from openai import OpenAI as OpenAIClient

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.documents import Document
import json
from scrape_firon import run_scraper
from rag_pipeline import run_pipeline


load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run startup scripts
print("--- Starting Startup Scripts ---")
run_scraper()
run_pipeline()
print("--- Startup Scripts Completed ---")

# Load vector store from disk (created by rag_pipeline)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})


# Create LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

# RAG prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are Firon AI, the helpful assistant for Firon Roofing. 
Answer the user's question based on the provided context. 
Be friendly, professional, and concise. If the answer isn't in the context, say you don't know and suggest contacting Firon directly.

Context:
{context}
"""),
    ("human", "{question}")
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# Intent classification (same as before)
from openai import OpenAI as OpenAIClient
client = OpenAIClient(api_key=os.getenv("OPENAI_API_KEY"))

INTENT_PROMPT = """
You are a lead qualification classifier for Firon Roofing. Based on the user's message (and conversation history if any), classify into one of:
- HIGH_INTENT: user asks for quote, price estimate, emergency repair, insurance claim help, or expresses urgency/budget.
- RESEARCHING: user asks about materials (GAF, shingles), warranties, comparison, process, financing, or certifications.
- FAQ: user asks about service areas, hours, contact info, general knowledge.
- CASUAL: greeting, testing, small talk, off-topic, or non-roofing questions.

User message: "{message}"
History: {history}

Return only the label: HIGH_INTENT, RESEARCHING, FAQ, or CASUAL.
"""

def classify_intent(message: str, history: list) -> str:
    hist_str = "\n".join([f"{h['role']}: {h['content']}" for h in history[-3:]]) if history else "None"
    prompt = INTENT_PROMPT.format(message=message, history=hist_str)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return response.choices[0].message.content.strip()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    answer: str
    intent: str
    handoff_required: bool

class LeadRequest(BaseModel):
    name: str
    email: EmailStr
    history: List[dict]

@app.post("/lead")
async def capture_lead(lead: LeadRequest):
    # For prototype, just log and send email (using your email credentials)
    # In production, use environment variables for SMTP.
    transcript = "\n".join([f"{m['role']}: {m['content']}" for m in lead.history])
    print(f"Lead Name: {lead.name}, Email: {lead.email}\nTranscript:\n{transcript}")
    
    # Optionally send email to Firon's contact
    # For now, we'll just return success
    return {"status": "captured"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    answer = rag_chain.invoke(req.message)
    intent = classify_intent(req.message, req.history)
    handoff = intent == "HIGH_INTENT"
    return ChatResponse(answer=answer, intent=intent, handoff_required=handoff)

@app.get("/health")
def health():
    return {"status": "ok"}

