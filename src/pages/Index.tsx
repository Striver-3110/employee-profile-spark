
import React, { useState } from 'react';
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
import { employeeData } from "@/data/mockData";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [employee, setEmployee] = useState(employeeData);
  
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
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <AboutMe about={employee.about} />
            <EmploymentDetails joinedDate={employee.joinedDate} />
            <CreativePursuits 
              pursuits={employee.creativePursuits} 
              onUpdate={handleUpdateCreativePursuits} 
            />
            <Icebreakers icebreakers={employee.icebreakers} />
            <CareerProgression progression={employee.progression} />
            <FeedbackSection feedback={employee.feedback} />
          </div>
          
          {/* Right column */}
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
            <CalibrationData 
              performancePotentialGrid={employee.calibration.performancePotentialGrid}
              skillLevels={employee.calibration.skillLevels}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
