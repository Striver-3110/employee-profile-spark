
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from '@/data/mockData';

interface Project {
  projectName: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

interface CareerProgressionProps {
  progression: Project[];
}

const CareerProgression: React.FC<CareerProgressionProps> = ({ progression }) => {
  // Sort progression by start date (most recent first)
  const sortedProgression = [...progression].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Career Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
          
          <div className="space-y-8">
            {sortedProgression.map((project, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 
                  ${project.current ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${project.current ? 'bg-blue-500' : 'bg-gray-400'}`} />
                </div>
                
                {/* Content */}
                <div className={`p-4 rounded-lg ${project.current ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <h3 className="font-medium text-lg">{project.projectName}</h3>
                  <p className="text-gray-600">{project.role}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-500">
                      {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                    </span>
                    {project.current && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgression;
