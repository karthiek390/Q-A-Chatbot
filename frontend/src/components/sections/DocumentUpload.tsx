
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File } from "lucide-react";

interface DocumentUploadProps {
  onFileUpload: (file: File) => void;
}

export const DocumentUpload = ({ onFileUpload }: DocumentUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      onFileUpload(file);
    } else {
      alert('Please upload a PDF, Word document, or text file.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Upload Your Document</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Drag and drop your file here, or click to browse. We support PDF, Word, and text files.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-0">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-green-400 bg-green-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-100 to-green-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">
                  Drop your document here
                </h3>
                <p className="text-slate-600">
                  or click to browse your files
                </p>
              </div>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700"
              >
                <File className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <p className="text-xs text-slate-500">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
