FROM python:3.10-slim

WORKDIR /app

COPY . .

# System dependencies for PDF parsing and other features
RUN apt-get update && apt-get install -y \
    build-essential \
    libmagic-dev \
    poppler-utils \
    && apt-get clean

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN python -m nltk.downloader punkt stopwords

EXPOSE 8501

CMD ["streamlit", "run", "main.py", "--server.port=8501", "--server.address=0.0.0.0"]