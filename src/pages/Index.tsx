
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

const Index = () => {
  const [employee, setEmployee] = useState(employeeData);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Mock date for last calibration update
  const lastCalibrationUpdate = new Date(2025, 1, 15); // February 15, 2025

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="container mx-auto py-8 px-4">
        {/* Profile header with larger size and improved styling */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <ProfileHeader 
            name={employee.name}
            image={employee.image}
            designation={employee.designation}
            socialLinks={employee.socialLinks}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
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
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <SkillsDisplay 
                skills={employee.skills} 
                role={employee.role} 
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
