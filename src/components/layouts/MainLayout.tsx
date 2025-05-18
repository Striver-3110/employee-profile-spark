
import React from 'react';
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
import { Toaster } from "@/components/ui/sonner";
import { useEmployee } from "@/contexts/EmployeeContext";

// Define default social links for the ProfileHeader component
const defaultSocialLinks = [
  { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
  { platform: "github", url: "https://github.com/johndoe" },
  { platform: "twitter", url: "https://twitter.com/johndoe" }
];

const MainLayout: React.FC = () => {
  const { 
    employee, 
    roleGroup, 
    isLoading, 
    handleUpdateAbout,
    handleUpdateSkills
  } = useEmployee();

  // Mock date for last calibration update
  const lastCalibrationUpdate = new Date(2025, 1, 15); // February 15, 2025

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="container mx-auto py-4 sm:py-8 px-4">
        {/* Profile header with larger size and improved styling */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
          <ProfileHeader socialLinks={defaultSocialLinks} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main content with tabs */}
          <div className="lg:col-span-3">
            <TabsContainer 
              aboutComponent={
                <div className="space-y-6">
                  <AboutMe 
                    about={employee.about} 
                    isLoading={isLoading} 
                    onUpdate={handleUpdateAbout} 
                  />
                  <SkillsDisplay 
                    skills={employee.skills} 
                    role={employee.role}
                    roleGroup={roleGroup}
                    onUpdate={handleUpdateSkills}
                    employeeId={employee.name}
                  />
                </div>
              }
              personalInfoComponents={[
                <CreativePursuits 
                  employeeId={employee.name} 
                  isLoading={isLoading} 
                />,
                <Icebreakers 
                  employeeId={employee.name}
                  isLoading={isLoading} 
                />
              ]}
              careerComponents={[
                <EmploymentDetails isLoading={isLoading} employeeId={employee.name} />,
                <CareerProgression employeeId={employee.name} />
              ]}
              metricsComponents={[
                <FeedbackSection feedback={employee.feedback} />,
                <CalibrationData 
                  performancePotentialGrid={employee.calibration.performancePotentialGrid}
                  skillLevels={employee.calibration.skillLevels}
                  lastUpdated={lastCalibrationUpdate}
                />
              ]}
              peopleComponent={
                <MyPeople 
                  team={employee.people.team}
                  pod={employee.people.pod}
                  lead={employee.people.lead}
                  buddy={employee.people.buddy}
                  techAdvisor={employee.people.techAdvisor}
                  teamMembers={employee.people.teamMembers}
                  role={employee.role}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
