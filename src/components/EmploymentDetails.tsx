
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, calculateTenure } from '@/data/mockData';
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";

interface EmploymentDetailsProps {
  isLoading?: boolean;
  employeeId?: string; // Make employeeId optional
}

const EmploymentDetails: React.FC<EmploymentDetailsProps> = ({ isLoading: controlledLoading, employeeId }) => {
  // Use React Query to fetch employee details
  const { data: employeeDetails, isLoading: queryLoading, error } = useQuery({
    queryKey: ['employeeDetails'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/method/one_view.api.user.get_employee_details', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }

        const data = await response.json();
        return data.message;
      } catch (error) {
        console.error('Error fetching employee details:', error);
        toast.error('Failed to load employment details');
        throw error;
      }
    }
  });

  // Determine if we're in a loading state
  const isLoading = controlledLoading || queryLoading;

  // Extract date of joining from employee details
  const joinedDate = employeeDetails?.date_of_joining || '';

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Failed to load employment details. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Employment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-500">Date of Joining</h3>
            <p className="font-medium">{joinedDate ? formatDate(joinedDate) : 'Not available'}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Tenure</h3>
            <p className="font-medium">{joinedDate ? calculateTenure(joinedDate) : 'Not available'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentDetails;
