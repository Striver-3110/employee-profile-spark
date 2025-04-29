
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Icebreaker {
  question: string;
  answer: string;
}

interface IcebreakersProps {
  icebreakers: Icebreaker[];
}

const Icebreakers: React.FC<IcebreakersProps> = ({ icebreakers }) => {
  return (
    <Card className="mb-6">
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
