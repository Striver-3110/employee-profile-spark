
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutMeProps {
  about: string;
  isLoading?: boolean;
}

const AboutMe: React.FC<AboutMeProps> = ({ about, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
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
