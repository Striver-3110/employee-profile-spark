
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
  const handleUpdateCreativePursuits = (pursuits: string[]) => {
    setEmployee((prev) => ({
      ...prev,
      creativePursuits: pursuits,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="container mx-auto py-8 px-4">
        <ProfileHeader 
          name={employee.name}
          image={employee.image}
          designation={employee.designation}
          socialLinks={employee.socialLinks}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content with tabs */}
          <div className="lg:col-span-2">
            <TabsContainer 
              aboutComponent={<AboutMe about={employee.about} isLoading={isLoading} />}
              personalInfoComponents={[
                <CreativePursuits 
                  pursuits={employee.creativePursuits} 
                  onUpdate={handleUpdateCreativePursuits}
                  isLoading={isLoading} 
                />,
                <Icebreakers icebreakers={employee.icebreakers} isLoading={isLoading} />
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
                />
              ]}
            />
          </div>
          
          {/* Right column - kept outside tabs */}
          <div className="space-y-6">
            <MyPeople 
              team={employee.people.team}
              pod={employee.people.pod}
              lead={employee.people.lead}
              buddy={employee.people.buddy}
              techAdvisor={employee.people.techAdvisor}
              teamMembers={employee.people.teamMembers}
              role={employee.role}
            />
            <SkillsDisplay 
              skills={employee.skills} 
              role={employee.role} 
              onUpdate={handleUpdateSkills}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
