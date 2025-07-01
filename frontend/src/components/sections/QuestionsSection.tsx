
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";

interface QuestionsSectionProps {
  questions: string[];
  onQuestionSelect: (question: string) => void;
}

export const QuestionsSection = ({ questions, onQuestionSelect }: QuestionsSectionProps) => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl font-bold text-slate-800">Generated Questions</h2>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We've analyzed your document and generated some questions to get you started. 
            Click on any question to see the answer, or ask your own question below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
              onClick={() => onQuestionSelect(question)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-amber-200 group-hover:to-green-200 transition-all duration-300">
                    <MessageCircle className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {question}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto"
                    >
                      Get Answer →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
