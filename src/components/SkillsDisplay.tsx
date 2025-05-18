
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkillCategory from './skills/SkillCategory';
import AddSkillDialog from './skills/AddSkillDialog';
import { useSkillsManagement } from '@/hooks/useSkillsManagement';
import { SkillsByCategory } from '@/utils/skillUtils';

interface SkillsDisplayProps {
  skills: {
    expert: string[];
    intermediate: string[];
    beginner: string[];
    learning: string[];
  };
  role: string;
  roleGroup: string;
  onUpdate: (category: string, skills: string[]) => void;
  employeeId?: string;
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ 
  skills: initialSkills, 
  role, 
  roleGroup, 
  onUpdate, 
  employeeId = '' 
}) => {
  // References for drop zones
  const expertRef = useRef<HTMLDivElement>(null);
  const intermediateRef = useRef<HTMLDivElement>(null);
  const beginnerRef = useRef<HTMLDivElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);

  // Use our custom hook for skills management logic
  const {
    skills,
    isDialogOpen,
    selectedCategory,
    newSkill,
    filteredSuggestions,
    isLoading,
    techStackError,
    componentTitle,
    isTechRole,
    handleOpenDialog,
    handleInputChange,
    handleSelectSuggestion,
    handleAddSkill,
    handleDrop,
    handleDragStart,
    handleDragOver,
    handleDeleteSkill,
    setIsDialogOpen
  } = useSkillsManagement({
    employeeId,
    roleGroup,
    initialSkills,
    onUpdate
  });

  // Show error state if API call fails
  if (techStackError && !isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{componentTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Failed to load skills data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{componentTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <SkillCategory
            title="Expert"
            category="expert"
            skills={skills.expert}
            isLoading={isLoading}
            onOpenDialog={handleOpenDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteSkill}
          />
          <SkillCategory
            title="Intermediate"
            category="intermediate"
            skills={skills.intermediate}
            isLoading={isLoading}
            onOpenDialog={handleOpenDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteSkill}
          />
          <SkillCategory
            title="Beginner"
            category="beginner"
            skills={skills.beginner}
            isLoading={isLoading}
            onOpenDialog={handleOpenDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteSkill}
          />
          <SkillCategory
            title="Learning"
            category="learning"
            skills={skills.learning}
            isLoading={isLoading}
            onOpenDialog={handleOpenDialog}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteSkill}
          />
        </div>
      </CardContent>
      
      <AddSkillDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSkill={handleAddSkill}
        isLoading={isLoading}
        isTechRole={isTechRole}
        title={`Add ${isTechRole ? 'Technology' : 'Skill'}`}
        description={`Add a new ${isTechRole ? 'technology' : 'skill'} to your ${selectedCategory} level`}
        filteredSuggestions={filteredSuggestions}
        onInputChange={handleInputChange}
        onSelectSuggestion={handleSelectSuggestion}
        skillInput={newSkill}
      />
    </Card>
  );
};

export default SkillsDisplay;
