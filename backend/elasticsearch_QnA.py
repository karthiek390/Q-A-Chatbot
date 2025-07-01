import os
import nltk
import docx
import pandas as pd
from nltk.corpus import stopwords
from elasticsearch import Elasticsearch
from nltk.tokenize import word_tokenize

# Download stopwords if not already present
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class Elasticsearch_qna:
    def __init__(self, model, question):
        self.model = model
        self.question = question

    def read_data(self):
        """Read data from doc file and use file name as domain name"""
        doc_path = os.path.join(os.path.dirname(os.path.realpath("tempDir/files")), "files")
        if any(File.endswith(".docx") for File in os.listdir(doc_path)):
            doc_files = next(os.walk(doc_path))[2]
            doc_file = ''.join(doc_files)
            file_name, ext = doc_file.split(".")
            doc_file_path = os.path.join(doc_path, doc_file)
            doc = docx.Document(doc_file_path)
            data = []
            for i in doc.paragraphs:
                data.append(i.text)
            return data, file_name
        else:
            raise FileNotFoundError("No docx files found for data conversion.")

    def indexing(self, file_data, domain_name):
        """Run the Elasticsearch server before running chatbot"""

        # es = Elasticsearch("http://localhost:9200")
        # for idx,new_line in enumerate(file_data):
        #     body = {"sentence":new_line}
        #     es.index(index=domain_name, doc_type="sentences", id=idx, body=body)
        # return es
		

        es = Elasticsearch("http://localhost:9200")
        es.indices.delete(index=domain_name, ignore=[400, 404])
        for idx, line in enumerate(file_data):
            new_line = line.strip()
            body = {"sentence": new_line}
            es.index(index=domain_name, id=idx, body=body)
        return es

    def search_doc(self):
        """Search for relevant sentences in the document for the given question"""
        match = self.question_keywords()
        file_data, domain_name = self.read_data()
        es = self.indexing(file_data, domain_name)
        size = 3
        query_body = {
            "from": 0,
            "size": size,
            "query": {
                "dis_max": {
                    "queries": match,
                    "tie_breaker": 0.3
                }
            }
        }
        result_body = es.search(index=domain_name, body=query_body)['hits']['hits']
        sentences = [i['_source']['sentence'] for i in result_body]
        return sentences

    def question_keywords(self):
        """Extract keywords from the given question"""
        stop_words = stopwords.words('english')
        words = [word for word in self.question[0].split() if word.lower() not in stop_words]
        keywords = " ".join(words)
        keywords_split = keywords.split()
        match = []
        for i in keywords_split:
            match.append({"match": {"sentence": i}})
        return match

    def answering(self):
        """Answer the given Question using the model and elasticsearch context"""
        sentences = self.search_doc()
        answer = self.model({"question": self.question, "context": sentences})
        return answer