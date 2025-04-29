
import React, { useState, Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Briefcase, LayoutList } from "lucide-react";
import ChartBarIcon from './ChartBarIcon';

interface TabsContainerProps {
  aboutComponent: React.ReactNode;
  personalInfoComponents: React.ReactNode[];
  careerComponents: React.ReactNode[];
  metricsComponents: React.ReactNode[];
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  aboutComponent,
  personalInfoComponents,
  careerComponents,
  metricsComponents,
}) => {
  const [activeTab, setActiveTab] = useState("person");

  const TabSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-16" />
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6 w-full">
        <TabsTrigger value="person" className="flex items-center gap-2">
          <User size={16} />
          <span>Person</span>
        </TabsTrigger>
        <TabsTrigger value="career" className="flex items-center gap-2">
          <Briefcase size={16} />
          <span>Career</span>
        </TabsTrigger>
        <TabsTrigger value="metrics" className="flex items-center gap-2">
          <ChartBarIcon size={16} />
          <span>Metrics</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="person" className="space-y-6">
        <Suspense fallback={<TabSkeleton />}>
          {aboutComponent}
          {personalInfoComponents.map((component, index) => (
            <React.Fragment key={`personal-${index}`}>{component}</React.Fragment>
          ))}
        </Suspense>
      </TabsContent>
      
      <TabsContent value="career" className="space-y-6">
        <Suspense fallback={<TabSkeleton />}>
          {careerComponents.map((component, index) => (
            <React.Fragment key={`career-${index}`}>{component}</React.Fragment>
          ))}
        </Suspense>
      </TabsContent>
      
      <TabsContent value="metrics" className="space-y-6">
        <Suspense fallback={<TabSkeleton />}>
          {metricsComponents.map((component, index) => (
            <React.Fragment key={`metrics-${index}`}>{component}</React.Fragment>
          ))}
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
