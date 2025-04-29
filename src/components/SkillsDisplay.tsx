
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DialogComponent } from './ui/dialog-content';
import { skillSuggestions } from '@/data/mockData';
import { toast } from "sonner";

interface SkillsDisplayProps {
  skills: {
    expert: string[];
    intermediate: string[];
    beginner: string[];
    learning: string[];
  };
  role: string;
  onUpdate: (category: string, skills: string[]) => void;
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills, role, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newSkill, setNewSkill] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Determine if it's a tech or non-tech role
  const isTechRole = role === 'tech';
  const componentTitle = isTechRole ? 'Tech Stack' : 'Skill Set';
  
  // Get appropriate suggestions based on role
  const suggestions = isTechRole ? skillSuggestions.tech : skillSuggestions.nonTech;

  const handleOpenDialog = (category: string) => {
    setSelectedCategory(category);
    setNewSkill('');
    setFilteredSuggestions([]);
    setIsDialogOpen(true);
  };

  const handleInputChange = (value: string) => {
    setNewSkill(value);
    if (value.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }
    
    // Filter suggestions based on input
    const filtered = suggestions.filter(
      suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setNewSkill(suggestion);
    setFilteredSuggestions([]);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a valid skill");
      return;
    }
    
    if (selectedCategory && selectedCategory in skills) {
      const categorySkills = skills[selectedCategory as keyof typeof skills];
      
      // Check if skill already exists in any category
      const allSkills = [...skills.expert, ...skills.intermediate, ...skills.beginner, ...skills.learning];
      if (allSkills.includes(newSkill.trim())) {
        toast.error("This skill already exists in your skills list");
        return;
      }
      
      const updatedSkills = [...categorySkills, newSkill.trim()];
      onUpdate(selectedCategory, updatedSkills);
      setIsDialogOpen(false);
      toast.success(`Skill added to ${selectedCategory} successfully!`);
    }
  };

  // Helper function to render each skill category
  const renderSkillCategory = (title: string, category: string, skillList: string[]) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 capitalize">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(category)}>
          <Plus size={16} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skillList.length > 0 ? (
          skillList.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100">
              {skill}
            </Badge>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No skills added yet</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{componentTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderSkillCategory('Expert', 'expert', skills.expert)}
          {renderSkillCategory('Intermediate', 'intermediate', skills.intermediate)}
          {renderSkillCategory('Beginner', 'beginner', skills.beginner)}
          {renderSkillCategory('Learning', 'learning', skills.learning)}
        </div>
      </CardContent>
      
      <DialogComponent
        title={`Add ${isTechRole ? 'Technology' : 'Skill'}`}
        description={`Add a new ${isTechRole ? 'technology' : 'skill'} to your ${selectedCategory} level`}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="relative">
            <Input
              placeholder={isTechRole ? "e.g. React, Python, AWS" : "e.g. Project Management, UX Research"}
              value={newSkill}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            
            {filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full max-h-60 overflow-y-auto mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill}>Add</Button>
          </div>
        </div>
      </DialogComponent>
    </Card>
  );
};

export default SkillsDisplay;
