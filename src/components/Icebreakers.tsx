
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, SkipBack, CheckCheck, Edit, RefreshCcw } from "lucide-react";

interface Icebreaker {
  question: string;
  answer: string;
}

interface IcebreakersProps {
  icebreakers: Icebreaker[];
  isLoading?: boolean;
  onUpdate?: (icebreakers: Icebreaker[]) => void;
}

// A list of 30 icebreaker questions
const allIcebreakerQuestions = [
  "What's your favorite book and why?",
  "If you could have dinner with any historical figure, who would it be?",
  "What's your ideal weekend activity?",
  "If you could instantly master any skill, what would it be?",
  "What's the best advice you've ever received?",
  "What's your favorite travel destination?",
  "What hobby would you get into if time and money weren't an issue?",
  "What fictional world would you most like to live in?",
  "What's something you've always wanted to try but haven't yet?",
  "What three items would you take to a deserted island?",
  "What's your go-to productivity hack?",
  "What was your first job and what did you learn from it?",
  "What's your favorite way to unwind after work?",
  "What's the most memorable concert or live event you've attended?",
  "If you could instantly learn any language, which would you choose?",
  "What's a cause you're passionate about?",
  "What's your favorite family tradition?",
  "What's the most beautiful place you've ever visited?",
  "What's something people would be surprised to learn about you?",
  "If you could have any superpower, what would it be?",
  "What's the most adventurous thing you've ever done?",
  "What would be your ideal three-course meal?",
  "If you could live in any era of history, which would you choose?",
  "What's a skill you'd like to develop this year?",
  "What was the last book that deeply impacted you?",
  "If you could swap lives with anyone for a day, who would it be?",
  "What's the best piece of professional advice you've received?",
  "What's your favorite childhood memory?",
  "If you could solve one global problem, what would it be?",
  "What technology innovation are you most excited about?"
];

const Icebreakers: React.FC<IcebreakersProps> = ({ 
  icebreakers, 
  isLoading = false,
  onUpdate 
}) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionStep, setQuestionStep] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  
  const minQuestionsToAnswer = 5;
  const questionsAnswered = Object.keys(answers).length;
  
  const startQuestionnaire = () => {
    // Select random questions
    const shuffled = [...allIcebreakerQuestions].sort(() => 0.5 - Math.random());
    // Select more questions initially (e.g., 15) to allow for flexibility
    const selected = shuffled.slice(0, 15); 
    setSelectedQuestions(selected);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer('');
    setSkippedQuestions([]);
    setQuestionStep(1);
    setShowQuestionnaire(true);
  };
  
  const restartQuestionnaire = () => {
    // Ask for confirmation if there are already answers
    if (questionsAnswered > 0) {
      if (confirm("Are you sure you want to restart? All your answers will be lost.")) {
        startQuestionnaire();
      }
    } else {
      startQuestionnaire();
    }
  };
  
  const handleSkip = () => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    
    // Add to skipped questions if not already skipped
    if (!skippedQuestions.includes(currentQuestion)) {
      setSkippedQuestions(prev => [...prev, currentQuestion]);
    }
    
    // Move to the next question
    moveToNextQuestion();
  };
  
  const moveToNextQuestion = () => {
    let nextIndex = currentQuestionIndex + 1;
    
    // If we've reached the end of available questions, move to review
    if (nextIndex >= selectedQuestions.length) {
      if (questionsAnswered >= minQuestionsToAnswer) {
        setQuestionStep(2); // Move to review with what we have
      } else {
        // Not enough questions answered, show a message
        toast.warning(`Please answer at least ${minQuestionsToAnswer} questions. You've answered ${questionsAnswered}.`);
        
        // Reset to the first skipped question if available
        if (skippedQuestions.length > 0) {
          const firstSkippedIndex = selectedQuestions.findIndex(q => skippedQuestions.includes(q));
          if (firstSkippedIndex >= 0) {
            setCurrentQuestionIndex(firstSkippedIndex);
            setCurrentAnswer('');
            return;
          }
        }
      }
    } else {
      setCurrentQuestionIndex(nextIndex);
      setCurrentAnswer('');
    }
  };
  
  const handleNext = () => {
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [selectedQuestions[currentQuestionIndex]]: currentAnswer
    }));
    
    // Move to next question
    moveToNextQuestion();
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
    
    if (onUpdate) {
      onUpdate(newIcebreakers);
    }
    
    toast.success("Icebreaker answers submitted!");
    setShowQuestionnaire(false);
    setQuestionStep(0);
  };

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

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle>Ice Breakers</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {icebreakers && icebreakers.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">You've answered {icebreakers.length} icebreaker questions.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={startQuestionnaire} 
                className="gap-1"
              >
                <RefreshCcw size={16} />
                Restart
              </Button>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {icebreakers.map((icebreaker, index) => (
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
                ? `Question ${currentQuestionIndex + 1} | Answered: ${questionsAnswered}/${minQuestionsToAnswer}+` 
                : 'Review Your Answers'}
            </DialogTitle>
          </DialogHeader>

          {questionStep === 1 ? (
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
                  onClick={handleSkip}
                  className="gap-1"
                >
                  <SkipBack size={16} />
                  Skip
                </Button>
                {questionsAnswered >= minQuestionsToAnswer ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} variant="default" className="gap-1">
                      <CheckCheck size={16} />
                      Submit
                    </Button>
                    <Button onClick={handleNext}>
                      Next
                    </Button>
                  </div>
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
                {questionsAnswered < minQuestionsToAnswer && (
                  <p className="text-amber-600 mb-2 text-sm w-full">
                    Note: You've answered {questionsAnswered} out of minimum {minQuestionsToAnswer} required questions.
                  </p>
                )}
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={restartQuestionnaire}
                    className="gap-1"
                  >
                    <RefreshCcw size={16} />
                    Restart
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (questionsAnswered > 0) {
                          setQuestionStep(1);
                          // Go back to answering more questions
                          setCurrentQuestionIndex(Math.min(currentQuestionIndex, selectedQuestions.length - 1));
                          setCurrentAnswer('');
                        } else {
                          setShowQuestionnaire(false);
                        }
                      }}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="gap-1"
                      disabled={questionsAnswered < minQuestionsToAnswer}
                    >
                      <CheckCheck size={16} />
                      Submit
                    </Button>
                  </div>
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
