
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, calculateTenure } from '@/data/mockData';

interface EmploymentDetailsProps {
  joinedDate: string;
}

const EmploymentDetails: React.FC<EmploymentDetailsProps> = ({ joinedDate }) => {
  return (
    <Card className="mb-6">
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
