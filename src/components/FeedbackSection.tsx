
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from '@/data/mockData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackItem {
  recipient?: string;
  from?: string;
  date?: string;
  dueDate?: string;
  summary?: string;
  context?: string;
  status?: 'pending' | 'completed';
  initiatedBy?: string;
  initiatedDate?: string;
}

interface FeedbackSectionProps {
  feedback: {
    givenByMe: FeedbackItem[];
    givenToMe: FeedbackItem[];
    pendingToGive: FeedbackItem[];
    initiated: FeedbackItem[];
  };
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedback }) => {
  const [showWarning, setShowWarning] = useState({ given: false, received: false });
  const [visibleItems, setVisibleItems] = useState({ 
    received: 3,
    given: 3,
    pending: 3,
    initiated: 3
  });
  
  useEffect(() => {
    const checkFeedbackDates = () => {
      const now = new Date();
      
      // Check if the last feedback given was more than 3 months ago
      if (feedback.givenByMe.length > 0) {
        const lastGivenDate = new Date(feedback.givenByMe[0].date || '');
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        if (lastGivenDate < threeMonthsAgo) {
          setShowWarning(prev => ({ ...prev, given: true }));
        }
      } else {
        // If no feedback given yet, show warning
        setShowWarning(prev => ({ ...prev, given: true }));
      }
      
      // Check if the last feedback received was more than 3 months ago
      if (feedback.givenToMe.length > 0) {
        const lastReceivedDate = new Date(feedback.givenToMe[0].date || '');
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        if (lastReceivedDate < threeMonthsAgo) {
          setShowWarning(prev => ({ ...prev, received: true }));
        }
      } else {
        // If no feedback received yet, show warning
        setShowWarning(prev => ({ ...prev, received: true }));
      }
    };
    
    checkFeedbackDates();
  }, [feedback.givenByMe, feedback.givenToMe]);

  // Check if there's any feedback at all
  const hasFeedback = 
    feedback.givenByMe.length > 0 || 
    feedback.givenToMe.length > 0 || 
    feedback.pendingToGive.length > 0 ||
    feedback.initiated.length > 0;
  
  const loadMore = (section: keyof typeof visibleItems) => {
    setVisibleItems(prev => ({
      ...prev,
      [section]: prev[section] + 3
    }));
  };

  if (!hasFeedback) return null;

  const sortedFeedback = {
    givenByMe: [...feedback.givenByMe].sort((a, b) => 
      new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
    ),
    givenToMe: [...feedback.givenToMe].sort((a, b) => 
      new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
    ),
    pendingToGive: [...feedback.pendingToGive].sort((a, b) => 
      new Date(b.dueDate || '').getTime() - new Date(a.dueDate || '').getTime()
    ),
    initiated: [...(feedback.initiated || [])].sort((a, b) => 
      new Date(b.initiatedDate || '').getTime() - new Date(a.initiatedDate || '').getTime()
    )
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {showWarning.given && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertTitle className="flex items-center justify-between">
              Feedback Reminder
              <button onClick={() => setShowWarning(prev => ({ ...prev, given: false }))} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </AlertTitle>
            <AlertDescription>
              You haven't given feedback recently! Please consider initiating feedback for your colleagues.
            </AlertDescription>
          </Alert>
        )}
        
        {showWarning.received && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertTitle className="flex items-center justify-between">
              Feedback Reminder
              <button onClick={() => setShowWarning(prev => ({ ...prev, received: false }))} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </AlertTitle>
            <AlertDescription>
              You haven't received feedback recently! Consider asking your colleagues for feedback.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="receivedFeedback" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="receivedFeedback">
              Received
              {sortedFeedback.givenToMe.length > 0 && (
                <span className="ml-1 text-xs bg-gray-100 rounded-full px-2">
                  {sortedFeedback.givenToMe.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="givenFeedback">
              Given
              {sortedFeedback.givenByMe.length > 0 && (
                <span className="ml-1 text-xs bg-gray-100 rounded-full px-2">
                  {sortedFeedback.givenByMe.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pendingFeedback">
              Pending
              {sortedFeedback.pendingToGive.length > 0 && (
                <span className="ml-1 text-xs bg-red-100 text-red-800 rounded-full px-2">
                  {sortedFeedback.pendingToGive.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="initiatedFeedback">
              Initiated
              {sortedFeedback.initiated.length > 0 && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 rounded-full px-2">
                  {sortedFeedback.initiated.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="receivedFeedback" className="mt-4">
            {sortedFeedback.givenToMe.length > 0 ? (
              <div className="space-y-4">
                {sortedFeedback.givenToMe.slice(0, visibleItems.received).map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.from}</span>
                      <span className="text-sm text-gray-500">{formatDate(item.date || '')}</span>
                    </div>
                    <p className="text-gray-700">{item.summary}</p>
                  </div>
                ))}
                
                {visibleItems.received < sortedFeedback.givenToMe.length && (
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={() => loadMore('received')}>View More</Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No feedback received yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="givenFeedback" className="mt-4">
            {sortedFeedback.givenByMe.length > 0 ? (
              <div className="space-y-4">
                {sortedFeedback.givenByMe.slice(0, visibleItems.given).map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">To: {item.recipient}</span>
                      <span className="text-sm text-gray-500">{formatDate(item.date || '')}</span>
                    </div>
                    <p className="text-gray-700">{item.summary}</p>
                  </div>
                ))}
                
                {visibleItems.given < sortedFeedback.givenByMe.length && (
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={() => loadMore('given')}>View More</Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No feedback given yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="pendingFeedback" className="mt-4">
            {sortedFeedback.pendingToGive.length > 0 ? (
              <div className="space-y-4">
                {sortedFeedback.pendingToGive.slice(0, visibleItems.pending).map((item, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">For: {item.recipient}</span>
                      <span className="text-sm text-red-600">Due: {formatDate(item.dueDate || '')}</span>
                    </div>
                    <p className="text-gray-700">{item.context}</p>
                  </div>
                ))}
                
                {visibleItems.pending < sortedFeedback.pendingToGive.length && (
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={() => loadMore('pending')}>View More</Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No pending feedback to give.</p>
            )}
          </TabsContent>
          
          <TabsContent value="initiatedFeedback" className="mt-4">
            {sortedFeedback.initiated && sortedFeedback.initiated.length > 0 ? (
              <div className="space-y-4">
                {sortedFeedback.initiated.slice(0, visibleItems.initiated).map((item, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">
                        {item.initiatedBy === 'me' ? `For: ${item.recipient}` : `From: ${item.from}`}
                      </span>
                      <span className="text-sm text-blue-600">
                        Initiated: {formatDate(item.initiatedDate || '')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-700">{item.context || 'General feedback'}</p>
                      <span className={`text-sm ${
                        item.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {item.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {visibleItems.initiated < (sortedFeedback.initiated?.length || 0) && (
                  <div className="flex justify-center pt-2">
                    <Button variant="outline" onClick={() => loadMore('initiated')}>View More</Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No initiated feedback found.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
