import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { DocumentUpload } from "@/components/sections/DocumentUpload";
import { ProcessingSection } from "@/components/sections/ProcessingSection";
import { QuestionsSection } from "@/components/sections/QuestionsSection";
import { CustomQuestionSection } from "@/components/sections/CustomQuestionSection";
import { ThreeBackground } from "@/components/three/ThreeBackground";
import { useState } from "react";

export type ProcessingStep = 'upload' | 'processing' | 'questions' | 'chat';

export interface DocumentState {
  file: File | null;
  filename: string | null;            // <-- NEW: store backend filename
  isProcessing: boolean;
  isProcessed: boolean;
  generatedQuestions: { question: string, answer: string }[]; // question+answer
  customQuestions: { question: string; answer: string }[];
}

const API_BASE = "http://localhost:5000/api";

const uploadFileToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('File upload failed');
  const data = await res.json();
  return data.filename;
};

const generateQnA = async (filename: string) => {
  const res = await fetch(`${API_BASE}/generate-qna`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) throw new Error('QnA generation failed');
  return await res.json();
};

const getQuestions = async () => {
  const res = await fetch(`${API_BASE}/questions`);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return await res.json(); // [{ question, answer }]
};

const askQuestion = async (question: string) => {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Failed to get answer');
  return await res.json(); // { answer, ... }
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload');
  const [documentState, setDocumentState] = useState<DocumentState>({
    file: null,
    filename: null,
    isProcessing: false,
    isProcessed: false,
    generatedQuestions: [],
    customQuestions: []
  });

  // File upload
  const handleFileUpload = async (file: File) => {
    setDocumentState(prev => ({ ...prev, file, isProcessing: true }));
    setCurrentStep('processing');
    try {
      const filename = await uploadFileToBackend(file);
      setDocumentState(prev => ({ ...prev, filename }));
    } catch (err) {
      alert("File upload failed: " + err);
      setCurrentStep('upload');
    }
  };

  // Processing: Generate QnA
  const handleProcessingComplete = async () => {
    if (!documentState.filename) return;
    setDocumentState(prev => ({ ...prev, isProcessing: true }));
    try {
      await generateQnA(documentState.filename);
      const questions = await getQuestions();
      setDocumentState(prev => ({
        ...prev,
        isProcessing: false,
        isProcessed: true,
        generatedQuestions: questions // array of { question, answer }
      }));
      setCurrentStep('questions');
    } catch (err) {
      alert("Processing failed: " + err);
      setCurrentStep('upload');
    }
  };

  // On question selection (from generated)
  const handleGeneratedQuestionSelect = async (question: string) => {
    setCurrentStep('chat');
    const res = await askQuestion(question);
    setDocumentState(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, { question, answer: res.answer }]
    }));
  };

  // On custom question submit
  const handleCustomQuestion = async (question: string, _: string) => {
    const res = await askQuestion(question);
    setDocumentState(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, { question, answer: res.answer }]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-slate-50 relative overflow-hidden">
      <ThreeBackground isProcessing={documentState.isProcessing} />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <HeroSection />
          <div className="max-w-4xl mx-auto space-y-12">
            {currentStep === 'upload' && (
              <DocumentUpload onFileUpload={handleFileUpload} />
            )}
            {currentStep === 'processing' && (
              <ProcessingSection 
                fileName={documentState.file?.name || ''}
                onProcessingComplete={handleProcessingComplete}
                isProcessing={documentState.isProcessing}
              />
            )}
            {(currentStep === 'questions' || currentStep === 'chat') && (
              <>
                <QuestionsSection 
                  questions={documentState.generatedQuestions.map(q => q.question)}
                  onQuestionSelect={handleGeneratedQuestionSelect}
                />
                <CustomQuestionSection 
                  onQuestionSubmit={handleCustomQuestion}
                  previousQuestions={documentState.customQuestions}
                />
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default Index;