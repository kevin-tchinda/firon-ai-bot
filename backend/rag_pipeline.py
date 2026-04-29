import json
from llama_index.core import Document, VectorStoreIndex, Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.vector_stores.chroma.base import ChromaVectorStore
import chromadb
from dotenv import load_dotenv
import os

load_dotenv()

# Configure LlamaIndex
Settings.llm = OpenAI(model="gpt-4o-mini", temperature=0.2)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

# Load scraped knowledge
with open("firon_knowledge.json", "r") as f:
    pages = json.load(f)

documents = []
for page in pages:
    doc = Document(text=page["text"], metadata={"source": page["url"]})
    documents.append(doc)

# Setup Chroma (persistent)
chroma_client = chromadb.PersistentClient(path="./chroma_db")
try:
    chroma_client.delete_collection("firon_kb")
except:
    pass
collection = chroma_client.create_collection("firon_kb")
vector_store = ChromaVectorStore(chroma_collection=collection)

# Create index
index = VectorStoreIndex.from_documents(
    documents, vector_store=vector_store, show_progress=True
)
print("Index created and stored in ./chroma_db")