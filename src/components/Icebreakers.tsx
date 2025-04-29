
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface Icebreaker {
  question: string;
  answer: string;
}

interface IcebreakersProps {
  icebreakers: Icebreaker[];
  isLoading?: boolean;
}

const Icebreakers: React.FC<IcebreakersProps> = ({ icebreakers, isLoading = false }) => {
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
    <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Ice Breakers</CardTitle>
      </CardHeader>
      <CardContent>
        {icebreakers.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {icebreakers.map((icebreaker, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {icebreaker.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700">{icebreaker.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-gray-500 text-sm">No ice breakers available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Icebreakers;
