import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Bot } from "lucide-react";

interface CustomQuestionSectionProps {
  onQuestionSubmit: (question: string, answer: string) => void;
  previousQuestions: { question: string; answer: string }[];
}

export const CustomQuestionSection = ({ onQuestionSubmit, previousQuestions }: CustomQuestionSectionProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsLoading(true);
    try {
      // Call parent-provided async handler, which now does real backend call
      await onQuestionSubmit(question, "");
      setQuestion("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Ask Your Own Question</h2>
          <p className="text-slate-600">
            Have a specific question about your document? Ask away!
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know about your document?"
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="bg-gradient-to-r from-amber-500 to-green-600 hover:from-amber-600 hover:to-green-700"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {previousQuestions.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800">Previous Questions</h3>
            <div className="space-y-4">
              {previousQuestions.map((qa, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                      <span className="text-slate-800">{qa.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-slate-600" />
                      </div>
                      <p className="text-slate-700 leading-relaxed">{qa.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};