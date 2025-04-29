
import React, { useState, Suspense } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Briefcase, LayoutList, CirclePlus } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("about");

  const TabSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-16" />
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-6 w-full bg-white rounded-lg shadow-sm">
        <TabsTrigger value="about" className="flex items-center gap-2 py-3">
          <User size={16} />
          <span>About</span>
        </TabsTrigger>
        <TabsTrigger value="personal" className="flex items-center gap-2 py-3">
          <CirclePlus size={16} />
          <span>Personal</span>
        </TabsTrigger>
        <TabsTrigger value="career" className="flex items-center gap-2 py-3">
          <Briefcase size={16} />
          <span>Career</span>
        </TabsTrigger>
        <TabsTrigger value="metrics" className="flex items-center gap-2 py-3">
          <ChartBarIcon size={16} />
          <span>Metrics</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="about" className="space-y-6">
        <Suspense fallback={<TabSkeleton />}>
          {aboutComponent}
        </Suspense>
      </TabsContent>

      <TabsContent value="personal" className="space-y-6">
        <Suspense fallback={<TabSkeleton />}>
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
