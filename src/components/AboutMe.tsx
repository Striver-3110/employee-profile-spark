
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutMeProps {
  about: string;
}

const AboutMe: React.FC<AboutMeProps> = ({ about }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{about}</p>
      </CardContent>
    </Card>
  );
};

export default AboutMe;
