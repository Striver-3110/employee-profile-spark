
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from '@/data/mockData';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  name: string;
  title: string;
  expected_start_date: string;
  expected_end_date: string | null;
  status: string;
  project_link: string;
  description: string;
}

interface CareerProgressionProps {
  employeeId: string; // Add employeeId prop
}

const CareerProgression: React.FC<CareerProgressionProps> = ({ employeeId }) => {
  // Fetch projects using React Query
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['employeeProjects', employeeId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/method/one_view.api.project.get_employee_projects?employee_id=${encodeURIComponent(employeeId)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = (await response.json()).message;
        
        // Map returned projects to our interface format
        const projectsData = data.map((project: any) => ({
          id: project.name,
          name: project.name,
          title: project.title,
          expected_start_date: project.expected_start_date,
          expected_end_date: project.expected_end_date,
          status: project.status,
          project_link: project.project_link,
          description: project.description
        }));
        
        // Sort projects by start date in descending order (most recent first)
        return [...projectsData].sort((a, b) => {
          return new Date(b.expected_start_date).getTime() - new Date(a.expected_start_date).getTime();
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load career progression data');
        throw error;
      }
    },
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Career Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Career Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Failed to load career progression data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Career Progression</CardTitle>
      </CardHeader>
      <CardContent>
        {projects && projects.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
            
            <div className="space-y-8">
              {projects.map((project) => (
                <div key={project.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 
                    ${project.status === 'Active' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border border-gray-300'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${project.status === 'Active' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  </div>
                  
                  {/* Content */}
                  <div className={`p-4 rounded-lg ${project.status === 'Active' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <h3 className="font-medium text-lg">{project.title || project.name}</h3>
                    {project.description && (
                      <p className="text-gray-600 mb-2">{project.description}</p>
                    )}
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(project.expected_start_date)} - {project.expected_end_date ? formatDate(project.expected_end_date) : 'Present'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        project.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                      {project.project_link && (
                        <a 
                          href={project.project_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 text-gray-500 rounded-md text-center">
            No project history available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareerProgression;
