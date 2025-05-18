
import React from 'react';
import { EmployeeProvider } from '@/contexts/EmployeeContext';
import MainLayout from '@/components/layouts/MainLayout';

const Index = () => {
  return (
    <EmployeeProvider>
      <MainLayout />
    </EmployeeProvider>
  );
};

export default Index;
