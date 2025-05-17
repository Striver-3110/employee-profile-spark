
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Move } from "lucide-react";
import { DialogComponent } from './ui/dialog-content';
import { skillSuggestions } from '@/data/mockData';
import { toast } from "sonner";
import { employeeData } from "@/data/mockData";

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
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills, role, roleGroup, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newSkill, setNewSkill] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [draggedSkill, setDraggedSkill] = useState<{ skill: string; category: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create refs for each category for drop zones
  const expertRef = useRef<HTMLDivElement>(null);
  const intermediateRef = useRef<HTMLDivElement>(null);
  const beginnerRef = useRef<HTMLDivElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);

  // Get employeeId from mock data
  const employeeId = employeeData.name;

  // Determine component title based on role group
  const componentTitle = roleGroup === 'Technical Roles' ? 'Tech Stack' : 'Competency Map';
  
  // Get appropriate suggestions based on role
  const isTechRole = roleGroup === 'Technical Roles';
  const suggestions = isTechRole ? skillSuggestions.tech : skillSuggestions.nonTech;

  // Get all skills across all categories
  const allSkills = [...skills.expert, ...skills.intermediate, ...skills.beginner, ...skills.learning];

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
    
    // Filter suggestions based on input and exclude already added skills
    const filtered = suggestions.filter(
      suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase()) && 
        !allSkills.includes(suggestion)
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setNewSkill(suggestion);
    setFilteredSuggestions([]);
  };

  // API call to add a new skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a valid skill");
      return;
    }
    
    if (selectedCategory && selectedCategory in skills) {
      const techToAdd = newSkill.trim();
      
      // Check if skill already exists in any category
      if (allSkills.includes(techToAdd)) {
        toast.error("This skill already exists in your skills list");
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await fetch("/api/method/one_view.api.tech_stack.add_tech_stack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            skill: techToAdd,
            category: selectedCategory
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to add skill");
        }
        
        const updatedSkills = [...skills[selectedCategory as keyof typeof skills], techToAdd];
        onUpdate(selectedCategory, updatedSkills);
        setIsDialogOpen(false);
        toast.success(`Skill added to ${selectedCategory} successfully!`);
      } catch (error) {
        console.error("Error adding skill:", error);
        toast.error("Failed to add skill. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // API call to move a skill between categories (drag and drop)
  const handleDrop = async (targetCategory: string, e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedSkill) return;
    
    const { skill, category: sourceCategory } = draggedSkill;
    
    // If source and target are the same, do nothing
    if (sourceCategory === targetCategory) {
      setDraggedSkill(null);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First remove from source
      const removeResponse = await fetch("/api/method/one_view.api.tech_stack.remove_tech_stack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
          skill: skill,
          category: sourceCategory
        }),
      });
      
      if (!removeResponse.ok) {
        throw new Error("Failed to remove skill from source category");
      }
      
      // Then add to target
      const addResponse = await fetch("/api/method/one_view.api.tech_stack.add_tech_stack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
          skill: skill,
          category: targetCategory
        }),
      });
      
      if (!addResponse.ok) {
        throw new Error("Failed to add skill to target category");
      }
      
      // Update UI
      const sourceSkills = [...skills[sourceCategory as keyof typeof skills]];
      const updatedSourceSkills = sourceSkills.filter(s => s !== skill);
      onUpdate(sourceCategory, updatedSourceSkills);
      
      const targetSkills = [...skills[targetCategory as keyof typeof skills]];
      const updatedTargetSkills = [...targetSkills, skill];
      onUpdate(targetCategory, updatedTargetSkills);
      
      toast.success(`Moved "${skill}" from ${sourceCategory} to ${targetCategory}`);
    } catch (error) {
      console.error("Error moving skill:", error);
      toast.error("Failed to move skill. Please try again.");
    } finally {
      setIsLoading(false);
      setDraggedSkill(null);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (skill: string, category: string) => {
    setDraggedSkill({ skill, category });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // API call to delete a skill
  const handleDeleteSkill = async (category: string, skillToDelete: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/method/one_view.api.tech_stack.remove_tech_stack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
          skill: skillToDelete,
          category: category
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to remove skill");
      }
      
      const categorySkills = skills[category as keyof typeof skills];
      const updatedSkills = categorySkills.filter(skill => skill !== skillToDelete);
      onUpdate(category, updatedSkills);
      toast.success(`Removed "${skillToDelete}" from ${category}`);
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render each skill category
  const renderSkillCategory = (title: string, category: string, skillList: string[], ref: React.RefObject<HTMLDivElement>) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 capitalize">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleOpenDialog(category)}
          disabled={isLoading}
        >
          <Plus size={16} />
        </Button>
      </div>
      <div 
        ref={ref}
        className={`flex flex-wrap gap-2 min-h-[60px] p-2 border border-dashed ${isLoading ? 'bg-gray-50' : 'bg-transparent'} border-gray-300 rounded-md`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(category, e)}
      >
        {skillList.length > 0 ? (
          skillList.map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`bg-gray-100 group relative cursor-move flex items-center gap-1 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              draggable={!isLoading}
              onDragStart={() => handleDragStart(skill, category)}
            >
              <Move size={12} className="text-gray-500 mr-1" />
              {skill}
              <button 
                onClick={() => handleDeleteSkill(category, skill)}
                className="ml-1 h-4 w-4 rounded-full flex items-center justify-center bg-gray-200 hover:bg-red-500 hover:text-white"
                disabled={isLoading}
              >
                <X size={10} />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Drop skills here</p>
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
        <div className="space-y-2">
          {renderSkillCategory('Expert', 'expert', skills.expert, expertRef)}
          {renderSkillCategory('Intermediate', 'intermediate', skills.intermediate, intermediateRef)}
          {renderSkillCategory('Beginner', 'beginner', skills.beginner, beginnerRef)}
          {renderSkillCategory('Learning', 'learning', skills.learning, learningRef)}
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
              disabled={isLoading}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </DialogComponent>
    </Card>
  );
};

export default SkillsDisplay;
