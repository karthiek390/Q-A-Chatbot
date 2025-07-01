import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileText, Brain, Sparkles } from "lucide-react";

interface ProcessingSectionProps {
  fileName: string;
  onProcessingComplete: () => void;
  isProcessing: boolean;
}

export const ProcessingSection = ({ fileName, onProcessingComplete, isProcessing }: ProcessingSectionProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: FileText, label: "Reading document", description: "Extracting text content" },
    { icon: Brain, label: "Analyzing content", description: "Understanding context and meaning" },
    { icon: Sparkles, label: "Generating questions", description: "Creating intelligent questions" },
    { icon: CheckCircle, label: "Ready to chat", description: "Your document is ready!" }
  ];

  useEffect(() => {
    if (!isProcessing) return;
    setProgress(0);
    setCurrentStep(0);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onProcessingComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isProcessing, onProcessingComplete]);

  useEffect(() => {
    if (progress >= 25 && currentStep < 1) setCurrentStep(1);
    if (progress >= 50 && currentStep < 2) setCurrentStep(2);
    if (progress >= 75 && currentStep < 3) setCurrentStep(3);
    if (progress >= 100 && currentStep < 4) setCurrentStep(4);
  }, [progress, currentStep]);

  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Processing Document</h2>
          <p className="text-slate-600">
            Analyzing <span className="font-medium text-slate-800">{fileName}</span>
          </p>
        </div>
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-50 to-green-50 border border-amber-200'
                        : isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-green-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-300 text-slate-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                        {step.label}
                      </h3>
                      <p className={`text-sm ${isActive || isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};