
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, calculateTenure } from '@/data/mockData';
import { Skeleton } from "@/components/ui/skeleton";

interface EmploymentDetailsProps {
  joinedDate: string;
  isLoading?: boolean;
}

const EmploymentDetails: React.FC<EmploymentDetailsProps> = ({ joinedDate, isLoading = false }) => {
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

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Employment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-500">Date of Joining</h3>
            <p className="font-medium">{formatDate(joinedDate)}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Tenure</h3>
            <p className="font-medium">{calculateTenure(joinedDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentDetails;
