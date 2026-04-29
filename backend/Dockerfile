FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for Chroma and other libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port (FastAPI default)
EXPOSE 8000

# Start the application
# Note: main.py will run the scraper and pipeline upon import
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
