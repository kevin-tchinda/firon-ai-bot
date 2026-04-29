import json
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
import shutil

load_dotenv()

def run_pipeline():
    print("Starting RAG pipeline...")
    
    # Load scraped knowledge
    if not os.path.exists("firon_knowledge.json"):
        print("Error: firon_knowledge.json not found. Run scraper first.")
        return

    with open("firon_knowledge.json", "r") as f:
        pages = json.load(f)

    documents = []
    for page in pages:
        doc = Document(page_content=page["text"], metadata={"source": page["url"]})
        documents.append(doc)

    # Setup Chroma (persistent)
    persist_directory = "./chroma_db"
    
    # Clear existing index to prevent duplicates
    if os.path.exists(persist_directory):
        print(f"Clearing existing index at {persist_directory}...")
        shutil.rmtree(persist_directory)

    print("Creating new vector index...")
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Chroma.from_documents(
        documents, 
        embeddings, 
        persist_directory=persist_directory
    )
    
    print(f"Index created and stored in {persist_directory}")

if __name__ == "__main__":
    run_pipeline()