
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Edit, CheckCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Icebreaker {
  question: string;
  answer: string;
}

interface IcebreakersProps {
  icebreakers?: Icebreaker[];
  isLoading?: boolean;
  onUpdate?: (icebreakers: Icebreaker[]) => void;
  employeeId?: string;
}

const Icebreakers: React.FC<IcebreakersProps> = ({ 
  isLoading: propIsLoading = false,
  employeeId = "Alex Johnson" 
}) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionStep, setQuestionStep] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [iceBreakers, setIceBreakers] = useState<Icebreaker[]>([]);
  
  const queryClient = useQueryClient();
  const minQuestionsToAnswer = 5;
  
  // Fetch icebreakers
  const { isLoading: isLoadingIcebreakers, error: icebreakersError } = useQuery({
    queryKey: ['icebreakers', employeeId],
    queryFn: async () => {
      const response = await fetch('/api/method/one_view.api.know_your_team.get_know_your_team_questions', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      console.log('Fetched questions:', data);
      
      if (data.message) {
        setIceBreakers(data.message);
        return data.message;
      }
      return [];
    },
    retry: 1,
  });

  // Save icebreakers mutation
  const saveIcebreakersMutation = useMutation({
    mutationFn: async (newIcebreakers: Icebreaker[]) => {
      const requestBody = {
        employee: employeeId,
        questions: newIcebreakers
      };

      const response = await fetch('/api/method/one_view.api.know_your_team.set_know_your_team_questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to save questions');
      }

      const data = await response.json();
      console.log('Saved questions:', data);
      if (data.message) {
        setIceBreakers(data.message);
        return data.message;
      }
      return newIcebreakers;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['icebreakers', employeeId] });
      toast.success("Icebreakers saved successfully!");
      setShowQuestionnaire(false);
      setQuestionStep(0);
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to save icebreakers'}`);
    }
  });

  const startQuestionnaire = () => {
    // For now just open the questionnaire with existing questions
    setShowQuestionnaire(true);
    setQuestionStep(1);
    
    // If we have existing icebreakers, populate the answers
    if (iceBreakers.length > 0) {
      const initialAnswers: Record<string, string> = {};
      iceBreakers.forEach(item => {
        initialAnswers[item.question] = item.answer;
      });
      setAnswers(initialAnswers);
      setSelectedQuestions(iceBreakers.map(item => item.question));
      setCurrentQuestionIndex(0);
      setCurrentAnswer(iceBreakers[0]?.answer || '');
    }
  };
  
  const handleNext = () => {
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [selectedQuestions[currentQuestionIndex]]: currentAnswer
    }));
    
    // Move to next question
    let nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= selectedQuestions.length) {
      // Move to review
      setQuestionStep(2);
    } else {
      setCurrentQuestionIndex(nextIndex);
      // Populate with existing answer if exists
      setCurrentAnswer(answers[selectedQuestions[nextIndex]] || '');
    }
  };
  
  const handleEditAnswer = (question: string) => {
    setEditingQuestion(question);
    setCurrentAnswer(answers[question] || '');
  };
  
  const saveEditedAnswer = () => {
    if (editingQuestion && currentAnswer.trim()) {
      setAnswers(prev => ({
        ...prev,
        [editingQuestion]: currentAnswer
      }));
      setEditingQuestion(null);
      setCurrentAnswer('');
    }
  };
  
  const handleSubmit = () => {
    // Create new icebreakers from the answers
    const newIcebreakers = Object.entries(answers).map(([question, answer]) => ({
      question,
      answer
    }));
    
    saveIcebreakersMutation.mutate(newIcebreakers);
  };

  const isLoading = propIsLoading || isLoadingIcebreakers || saveIcebreakersMutation.isPending;

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (icebreakersError) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ice Breakers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading icebreakers. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle>Ice Breakers</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {iceBreakers && iceBreakers.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">You've answered {iceBreakers.length} icebreaker questions.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={startQuestionnaire} 
                className="gap-1"
              >
                <Edit size={16} />
                Edit Answers
              </Button>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {iceBreakers.map((icebreaker, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:bg-blue-50 px-4 py-3 rounded-lg">
                    {icebreaker.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-gray-50 rounded-lg mt-1">
                    <p className="text-gray-700">{icebreaker.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-blue-400" />
            <p className="text-gray-500 mb-4">Share some fun facts about yourself with your team!</p>
            <Button onClick={startQuestionnaire}>
              Start Questionnaire
            </Button>
          </div>
        )}
      </CardContent>

      {/* Icebreaker Questionnaire Dialog */}
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {questionStep === 1 
                ? `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}` 
                : 'Review Your Answers'}
            </DialogTitle>
          </DialogHeader>

          {questionStep === 1 && selectedQuestions.length > 0 ? (
            <div className="py-4">
              <h3 className="text-lg font-medium mb-3">{selectedQuestions[currentQuestionIndex]}</h3>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[120px] mb-4"
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      // Save current answer before going back
                      setAnswers(prev => ({
                        ...prev,
                        [selectedQuestions[currentQuestionIndex]]: currentAnswer
                      }));
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                      setCurrentAnswer(answers[selectedQuestions[currentQuestionIndex - 1]] || '');
                    } else {
                      setShowQuestionnaire(false);
                    }
                  }}
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  {currentQuestionIndex === selectedQuestions.length - 1 ? (
                    <Button 
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                      className="gap-1"
                    >
                      <CheckCheck size={16} />
                      Review
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNext}
                      disabled={!currentAnswer.trim()}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="max-h-[300px] overflow-y-auto mb-4">
                {Object.entries(answers).map(([question, answer], index) => (
                  <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg relative group">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEditAnswer(question)}
                    >
                      <Edit size={16} />
                    </Button>
                    <h4 className="font-medium mb-1 pr-8">{question}</h4>
                    <p className="text-gray-700">{answer}</p>
                  </div>
                ))}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Go back to editing questions
                      setQuestionStep(1);
                      setCurrentQuestionIndex(0);
                      setCurrentAnswer(answers[selectedQuestions[0]] || '');
                    }}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="gap-1"
                    disabled={saveIcebreakersMutation.isPending || Object.keys(answers).length === 0}
                  >
                    <CheckCheck size={16} />
                    Save
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Answer Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Answer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {editingQuestion && (
              <>
                <h3 className="text-lg font-medium mb-3">{editingQuestion}</h3>
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Edit your answer here..."
                  className="min-h-[120px] mb-4"
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingQuestion(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={saveEditedAnswer}
                    disabled={!currentAnswer.trim()}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Icebreakers;
