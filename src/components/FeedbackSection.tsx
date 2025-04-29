
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from '@/data/mockData';

interface FeedbackItem {
  recipient?: string;
  from?: string;
  date?: string;
  dueDate?: string;
  summary?: string;
  context?: string;
}

interface FeedbackSectionProps {
  feedback: {
    givenByMe: FeedbackItem[];
    givenToMe: FeedbackItem[];
    pendingToGive: FeedbackItem[];
  };
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedback }) => {
  // Check if there's any feedback at all
  const hasFeedback = 
    feedback.givenByMe.length > 0 || 
    feedback.givenToMe.length > 0 || 
    feedback.pendingToGive.length > 0;
  
  if (!hasFeedback) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="receivedFeedback" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="receivedFeedback">
              Received
              {feedback.givenToMe.length > 0 && (
                <span className="ml-1 text-xs bg-gray-100 rounded-full px-2">
                  {feedback.givenToMe.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="givenFeedback">
              Given
              {feedback.givenByMe.length > 0 && (
                <span className="ml-1 text-xs bg-gray-100 rounded-full px-2">
                  {feedback.givenByMe.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pendingFeedback">
              Pending
              {feedback.pendingToGive.length > 0 && (
                <span className="ml-1 text-xs bg-red-100 text-red-800 rounded-full px-2">
                  {feedback.pendingToGive.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="receivedFeedback" className="mt-4">
            {feedback.givenToMe.length > 0 ? (
              <div className="space-y-4">
                {feedback.givenToMe.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.from}</span>
                      <span className="text-sm text-gray-500">{formatDate(item.date || '')}</span>
                    </div>
                    <p className="text-gray-700">{item.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No feedback received yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="givenFeedback" className="mt-4">
            {feedback.givenByMe.length > 0 ? (
              <div className="space-y-4">
                {feedback.givenByMe.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">To: {item.recipient}</span>
                      <span className="text-sm text-gray-500">{formatDate(item.date || '')}</span>
                    </div>
                    <p className="text-gray-700">{item.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No feedback given yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="pendingFeedback" className="mt-4">
            {feedback.pendingToGive.length > 0 ? (
              <div className="space-y-4">
                {feedback.pendingToGive.map((item, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">For: {item.recipient}</span>
                      <span className="text-sm text-red-600">Due: {formatDate(item.dueDate || '')}</span>
                    </div>
                    <p className="text-gray-700">{item.context}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No pending feedback to give.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
