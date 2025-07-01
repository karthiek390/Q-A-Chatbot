from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from preprocessing import Preprocessing
from pipelines import pipeline
from elasticsearch_QnA import Elasticsearch_qna
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "./tempDir"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize models at startup (for efficiency)
qg_model = pipeline("question-generation")
mtqg_model = pipeline("multitask-qa-qg")

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/upload", methods=["POST"])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        # Restrict to allowed file extensions
        allowed_ext = {'txt', 'pdf', 'docx'}
        ext = file.filename.rsplit('.', 1)[-1].lower()
        if ext not in allowed_ext:
            return jsonify({'error': f'File type .{ext} not allowed'}), 400
        safe_filename = os.path.basename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, safe_filename)
        file.save(filepath)
        return jsonify({'filename': safe_filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/generate-qna", methods=["POST"])
def generate_qna():
    try:
        data = request.get_json()
        filename = data.get('filename')
        model_type = data.get('model', 'Auto_QnA')
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        model = qg_model if model_type == "Auto_QnA" else mtqg_model
        preprocessor = Preprocessing(model, filepath)
        qna_df = preprocessor.main()
        csv_path = os.path.join(UPLOAD_FOLDER, "qna.csv")
        qna_df.to_csv(csv_path, index=False)
        return jsonify({'message': 'QnA generated', 'num_qna': len(qna_df)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/questions", methods=["GET"])
def get_questions():
    try:
        csv_path = os.path.join(UPLOAD_FOLDER, "qna.csv")
        if not os.path.exists(csv_path):
            return jsonify({'error': 'No QnA generated yet'}), 404
        df = pd.read_csv(csv_path)
        qna_list = df.to_dict(orient='records')
        return jsonify(qna_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        question = data.get('question')
        csv_path = os.path.join(UPLOAD_FOLDER, "qna.csv")
        if not os.path.exists(csv_path):
            return jsonify({'error': 'No QnA available'}), 404
        df = pd.read_csv(csv_path)
        corpus = list(df["question"].values)
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(corpus)
        q = vectorizer.transform([question])
        cosine_sim = cosine_similarity(X, q).flatten()
        max_sim = np.max(cosine_sim)
        if max_sim >= 0.30:
            idx = np.argmax(cosine_sim)
            answer = df.iloc[idx]['answer']
            return jsonify({'answer': answer, 'source': 'tfidf'})
        elif max_sim > 0.05:
            result = Elasticsearch_qna(mtqg_model, [question])
            answer = result.answering()
            return jsonify({'answer': answer, 'source': 'elasticsearch'})
        else:
            return jsonify({'answer': 'There is no matching answer', 'source': 'none'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)