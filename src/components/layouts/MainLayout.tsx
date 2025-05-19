
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
import { useEmployee } from "@/contexts/EmployeeContext";

const MainLayout: React.FC = () => {
  const { 
    employee, 
    employeeId,
    roleGroup, 
    isLoading, 
    handleUpdateAbout,
    handleUpdateSkills
  } = useEmployee();

  // Mock date for last calibration update
  const lastCalibrationUpdate = new Date(2025, 1, 15); // February 15, 2025

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-4 sm:py-8 px-4">
        {/* Profile header with larger size and improved styling */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
          <ProfileHeader />
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
                    employeeId={employeeId}
                  />
                </div>
              }
              personalInfoComponents={[
                <CreativePursuits 
                  employeeId={employeeId} 
                  isLoading={isLoading} 
                />,
                <Icebreakers 
                  employeeId={employeeId}
                  isLoading={isLoading} 
                />
              ]}
              careerComponents={[
                <EmploymentDetails isLoading={isLoading} />,
                <CareerProgression />
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
