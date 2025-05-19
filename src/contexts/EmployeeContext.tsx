
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { employeeData } from "@/data/mockData";
import { getRoleGroup } from "@/utils/RoleUtils";
import { fetchEmployeeDetails, EmployeeResponse } from "@/services/api";
import { formatSkillsData } from "@/utils/skillUtils";

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
      performance: string; 
      potential: string;   
    };
    skillLevels: {
      skill: string;
      level: number;
    }[];
  };
  feedback: {
    givenByMe: {
      recipient?: string;
      date?: string;
      summary?: string;
    }[];
    givenToMe: {
      from?: string;
      date?: string;
      summary?: string;
    }[];
    pendingToGive: {
      recipient?: string;
      dueDate?: string;
      context?: string;
    }[];
    initiated: {
      recipient?: string;
      from?: string;
      initiatedBy: "me" | "other";
      initiatedDate: string;
      status: "pending" | "completed";
      context: string;
    }[];
  };
  joiningDate?: string;
}

interface EmployeeContextType {
  employee: Employee;
  employeeId: string;
  apiData: EmployeeResponse | null;
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
  const [apiData, setApiData] = useState<EmployeeResponse | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');
  
  // Initialize employee state with mock data and extend it
  const [employee, setEmployee] = useState<Employee>({
    ...employeeData,
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    address: "123 Main St, San Francisco, CA",
    // Clear icebreakers data to start fresh
    icebreakers: [],
    // Ensure feedback structure matches the Employee interface
    feedback: {
      givenByMe: [
        {
          recipient: "Priya Patel",
          date: "2023-09-15",
          summary: "Outstanding work on the authentication system"
        }
      ],
      givenToMe: [
        { from: "Sarah Thompson", date: "2023-10-05", summary: "Excellent leadership on the dashboard project" },
        { from: "Dr. Rachel Kim", date: "2023-07-20", summary: "Great problem-solving skills demonstrated in the recent sprint" }
      ],
      pendingToGive: [
        { recipient: "James Wilson", dueDate: "2023-11-30", context: "Q3 Performance Review" }
      ],
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const empData = await fetchEmployeeDetails();
        setApiData(empData);
        setEmployeeId(empData.name);
        
        // Map API data to our employee state
        updateEmployeeFromApiData(empData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        // We'll set isLoading to false after a slight delay for UI purposes
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    
    fetchData();
  }, []);
  
  // Update employee data when API data changes
  const updateEmployeeFromApiData = (apiData: EmployeeResponse) => {
    // Map API skills data
    let skillsData = { expert: [], intermediate: [], beginner: [], learning: [] };
    
    if (apiData.custom_tech_stack && apiData.custom_tech_stack.length > 0) {
      const mappedSkills = apiData.custom_tech_stack.map(item => ({
        skill: item.skill,
        category: item.proficiency_level.toLowerCase()
      }));
      
      skillsData = formatSkillsData(mappedSkills);
    }
    
    // Map API icebreaker data
    const icebreakers = apiData.custom_employee_icebreaker_question ?
      apiData.custom_employee_icebreaker_question.map(item => ({
        question: item.question,
        answer: item.answer
      })) : [];
    
    // Map creative pursuits
    const creativePursuits = apiData.custom_passionate_about ?
      apiData.custom_passionate_about.map(item => item.passionate_about) : [];
    
    setEmployee(prev => ({
      ...prev,
      name: apiData.employee_name || prev.name,
      role: apiData.designation || prev.role,
      about: apiData.custom_about || prev.about,
      email: apiData.company_email || prev.email,
      phone: apiData.cell_number || prev.phone,
      address: apiData.current_address || prev.address,
      joiningDate: apiData.date_of_joining,
      skills: skillsData,
      people: {
        ...prev.people,
        team: apiData.custom_team || prev.people.team,
        pod: apiData.custom_pod || prev.people.pod,
        lead: apiData.custom_tech_lead || prev.people.lead,
        buddy: apiData.custom_buddy || prev.people.buddy,
        techAdvisor: apiData.custom_tech_advisor || prev.people.techAdvisor,
      },
      creativePursuits,
      icebreakers
    }));
    
    // Set role group based on employee role
    setRoleGroup(getRoleGroup(apiData.designation));
  };
  
  useEffect(() => {
    // Set role group based on employee role
    setRoleGroup(getRoleGroup(employee.role));
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
    employeeId,
    apiData,
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
