
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { employeeData } from "@/data/mockData";
import { getRoleGroup } from "@/utils/RoleUtils";

// Define the shape of our employee data
export interface Employee {
  name: string;
  role: string;
  about: string;
  email: string;
  phone: string;
  address: string;
  skills: {
    expert: string[];
    intermediate: string[];
    beginner: string[];
    learning: string[];
  };
  people: {
    team: string;
    pod: string;
    lead: string;
    buddy: string;
    techAdvisor: string;
    teamMembers: string[];
  };
  creativePursuits: string[];
  icebreakers: { question: string; answer: string }[];
  calibration: {
    performancePotentialGrid: {
      performance: number;
      potential: number;
    };
    skillLevels: {
      skill: string;
      level: number;
    }[];
  };
  feedback: {
    initiated: {
      recipient?: string;
      from?: string;
      initiatedBy: "me" | "other";
      initiatedDate: string;
      status: "pending" | "completed";
      context: string;
    }[];
  };
}

interface EmployeeContextType {
  employee: Employee;
  roleGroup: string;
  isLoading: boolean;
  handleUpdateAbout: (newAbout: string) => void;
  handleUpdateCreativePursuits: (pursuits: string[]) => void;
  handleUpdateIcebreakers: (icebreakers: { question: string; answer: string }[]) => void;
  handleUpdateSkills: (category: string, skills: string[]) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  // Initialize employee state with mock data and extend it
  const [employee, setEmployee] = useState<Employee>({
    ...employeeData,
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    address: "123 Main St, San Francisco, CA",
    // Clear icebreakers data to start fresh
    icebreakers: [],
    feedback: {
      ...employeeData.feedback,
      initiated: [
        {
          recipient: "Sarah Johnson",
          initiatedBy: "me",
          initiatedDate: "2025-03-15T10:30:00",
          status: "pending",
          context: "Q1 Performance Review"
        },
        {
          from: "Mike Chen",
          initiatedBy: "other",
          initiatedDate: "2025-03-20T14:45:00",
          status: "completed",
          context: "Project Collaboration Feedback"
        },
        {
          recipient: "Lisa Wong",
          initiatedBy: "me",
          initiatedDate: "2025-02-10T09:15:00",
          status: "completed",
          context: "Peer Review"
        },
        {
          from: "David Kim",
          initiatedBy: "other",
          initiatedDate: "2025-01-25T11:00:00",
          status: "pending",
          context: "Team Leadership Assessment"
        }
      ]
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [roleGroup, setRoleGroup] = useState('');
  
  useEffect(() => {
    // Set role group based on employee role
    setRoleGroup(getRoleGroup(employee.role));
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [employee.role]);
  
  // Handlers for updating employee data
  const handleUpdateAbout = (newAbout: string) => {
    setEmployee(prev => ({
      ...prev,
      about: newAbout
    }));
  };
  
  const handleUpdateCreativePursuits = (pursuits: string[]) => {
    setEmployee((prev) => ({
      ...prev,
      creativePursuits: pursuits,
    }));
  };
  
  const handleUpdateIcebreakers = (icebreakers: { question: string, answer: string }[]) => {
    setEmployee((prev) => ({
      ...prev,
      icebreakers: icebreakers,
    }));
  };
  
  const handleUpdateSkills = (category: string, skills: string[]) => {
    setEmployee((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: skills,
      },
    }));
  };

  const value = {
    employee,
    roleGroup,
    isLoading,
    handleUpdateAbout,
    handleUpdateCreativePursuits,
    handleUpdateIcebreakers,
    handleUpdateSkills
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};
