import React, { useState, useEffect } from 'react';
import ProfileHeader from "@/components/ProfileHeader";
import AboutMe from "@/components/AboutMe";
import EmploymentDetails from "@/components/EmploymentDetails";
import CreativePursuits from "@/components/CreativePursuits";
import Icebreakers from "@/components/Icebreakers";
import MyPeople from "@/components/MyPeople";
import SkillsDisplay from "@/components/SkillsDisplay";
import CareerProgression from "@/components/CareerProgression";
import FeedbackSection from "@/components/FeedbackSection";
import CalibrationData from "@/components/CalibrationData";
import TabsContainer from "@/components/TabsContainer";
import { employeeData } from "@/data/mockData";
import { Toaster } from "@/components/ui/sonner";

// Utility to determine role group
const getRoleGroup = (role: string): string => {
  const technicalRoles = [
    'Software Craftsperson', 
    'Software Craftsperson - Tech Lead', 
    'Software Craftsperson - Tech Advisor',
    'AI Craftsperson',
    'Test Craftsperson',
    'Test Craftsperson (Manual)',
    'Test Craftsperson (Automation)',
    'BQA',
    'Intern',
    'tech' // For backward compatibility
  ];
  
  const designProductRoles = [
    'Product Craftsperson',
    'Product Kick-off Specialist',
    'Product Manager',
    'Product Analyst',
    'Product Manager - Guild Lead',
    'UI/UX Craftsperson',
    'Content Manager'
  ];
  
  const peopleOpsRoles = [
    'People Success Manager',
    'People Success Specialist',
    'Talent Acquisition Specialist'
  ];
  
  const opsStrategyRoles = [
    'Operations Manager',
    'Executive Assistant',
    'Operation Head'
  ];
  
  const financeAdminRoles = ['Accountant'];
  
  const leadershipRoles = [
    'Engineer Manager',
    'Co-Founder',
    'Technical Program Manager',
    'co-founder' // For backward compatibility
  ];
  
  if (technicalRoles.includes(role)) return 'Technical Roles';
  if (designProductRoles.includes(role)) return 'Design & Product';
  if (peopleOpsRoles.includes(role)) return 'People Operations';
  if (opsStrategyRoles.includes(role)) return 'Operations & Strategy';
  if (financeAdminRoles.includes(role)) return 'Finance & Admin';
  if (leadershipRoles.includes(role)) return 'Leadership / Founders';
  
  return 'Other Roles';
};

const Index = () => {
  const [employee, setEmployee] = useState({
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
          status: "pending" as "pending" | "completed",
          context: "Q1 Performance Review"
        },
        {
          from: "Mike Chen",
          initiatedBy: "other",
          initiatedDate: "2025-03-20T14:45:00",
          status: "completed" as "pending" | "completed",
          context: "Project Collaboration Feedback"
        },
        {
          recipient: "Lisa Wong",
          initiatedBy: "me",
          initiatedDate: "2025-02-10T09:15:00",
          status: "completed" as "pending" | "completed",
          context: "Peer Review"
        },
        {
          from: "David Kim",
          initiatedBy: "other",
          initiatedDate: "2025-01-25T11:00:00",
          status: "pending" as "pending" | "completed",
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
  
  // Make sure the handleUpdateIcebreakers handler is implemented correctly
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

  // Mock date for last calibration update
  const lastCalibrationUpdate = new Date(2025, 1, 15); // February 15, 2025

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="container mx-auto py-4 sm:py-8 px-4">
        {/* Profile header with larger size and improved styling */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
          <ProfileHeader 
            socialLinks={employee.socialLinks}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main content with tabs */}
          <div className="lg:col-span-2">
            <TabsContainer 
              aboutComponent={
                <AboutMe 
                  about={employee.about} 
                  isLoading={isLoading} 
                  onUpdate={handleUpdateAbout} 
                />
              }
              personalInfoComponents={[
                <CreativePursuits 
                  pursuits={employee.creativePursuits} 
                  onUpdate={handleUpdateCreativePursuits}
                  isLoading={isLoading} 
                />,
                <Icebreakers 
                  icebreakers={employee.icebreakers} 
                  isLoading={isLoading} 
                  onUpdate={handleUpdateIcebreakers}
                />
              ]}
              careerComponents={[
                <EmploymentDetails joinedDate={employee.joinedDate} isLoading={isLoading} />,
                <CareerProgression progression={employee.progression} />
              ]}
              metricsComponents={[
                <FeedbackSection feedback={employee.feedback} />,
                <CalibrationData 
                  performancePotentialGrid={employee.calibration.performancePotentialGrid}
                  skillLevels={employee.calibration.skillLevels}
                  lastUpdated={lastCalibrationUpdate}
                />
              ]}
            />
          </div>
          
          {/* Right column - improved styling */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
              <MyPeople 
                team={employee.people.team}
                pod={employee.people.pod}
                lead={employee.people.lead}
                buddy={employee.people.buddy}
                techAdvisor={employee.people.techAdvisor}
                teamMembers={employee.people.teamMembers}
                role={employee.role}
              />
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
              <SkillsDisplay 
                skills={employee.skills} 
                role={employee.role}
                roleGroup={roleGroup}
                onUpdate={handleUpdateSkills}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
