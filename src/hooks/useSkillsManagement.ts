
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { 
  fetchEmployeeSkills, 
  addSkill, 
  removeSkill, 
  formatSkillsData, 
  getAllSkills, 
  SkillsByCategory 
} from '@/utils/skillUtils';
import { skillSuggestions } from '@/data/mockData';

interface UseSkillsManagementProps {
  employeeId: string;
  roleGroup: string;
  initialSkills: SkillsByCategory;
  onUpdate: (category: string, skills: string[]) => void;
}

export const useSkillsManagement = ({
  employeeId,
  roleGroup,
  initialSkills,
  onUpdate
}: UseSkillsManagementProps) => {
  const [skills, setSkills] = useState<SkillsByCategory>(initialSkills);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newSkill, setNewSkill] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [draggedSkill, setDraggedSkill] = useState<{ skill: string; category: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine component title and suggestions based on role group
  const isTechRole = roleGroup === 'Technical Roles';
  const componentTitle = isTechRole ? 'Tech Stack' : 'Competency Map';
  const suggestions = isTechRole ? skillSuggestions.tech : skillSuggestions.nonTech;

  // Fetch tech stack data using the API
  const { 
    data: techStackData, 
    isLoading: isLoadingTechStack, 
    error: techStackError 
  } = useQuery({
    queryKey: ['techStack', employeeId],
    queryFn: () => fetchEmployeeSkills(employeeId),
    enabled: !!employeeId
  });

  // Update skills state when tech stack data is fetched
  useEffect(() => {
    if (techStackData) {
      const formattedSkills = formatSkillsData(techStackData);
      
      setSkills(formattedSkills);
      // Update parent component as well
      Object.keys(formattedSkills).forEach((category) => {
        onUpdate(category, formattedSkills[category as keyof typeof formattedSkills]);
      });
    }
  }, [techStackData, onUpdate]);

  // Get all skills across all categories
  const allSkills = getAllSkills(skills);

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
      const skillToAdd = newSkill.trim();
      
      // Check if skill already exists in any category
      if (allSkills.includes(skillToAdd)) {
        toast.error("This skill already exists in your skills list");
        return;
      }
      
      setIsLoading(true);
      
      try {
        await addSkill(employeeId, skillToAdd, selectedCategory);
        
        const updatedSkills = [...skills[selectedCategory as keyof typeof skills], skillToAdd];
        
        // Update local state
        setSkills(prev => ({
          ...prev,
          [selectedCategory]: updatedSkills
        }));
        
        // Update parent component
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
      await removeSkill(employeeId, skill, sourceCategory);
      
      // Then add to target
      await addSkill(employeeId, skill, targetCategory);
      
      // Update local state
      setSkills(prev => {
        const sourceSkills = [...prev[sourceCategory as keyof typeof skills]];
        const updatedSourceSkills = sourceSkills.filter(s => s !== skill);
        
        const targetSkills = [...prev[targetCategory as keyof typeof skills]];
        const updatedTargetSkills = [...targetSkills, skill];
        
        return {
          ...prev,
          [sourceCategory]: updatedSourceSkills,
          [targetCategory]: updatedTargetSkills
        };
      });
      
      // Update parent component
      onUpdate(sourceCategory, skills[sourceCategory as keyof typeof skills].filter(s => s !== skill));
      onUpdate(targetCategory, [...skills[targetCategory as keyof typeof skills], skill]);
      
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
      await removeSkill(employeeId, skillToDelete, category);
      
      // Update local state
      setSkills(prev => {
        const updatedCategorySkills = prev[category as keyof typeof skills].filter(skill => skill !== skillToDelete);
        return {
          ...prev,
          [category]: updatedCategorySkills
        };
      });
      
      // Update parent component
      onUpdate(category, skills[category as keyof typeof skills].filter(skill => skill !== skillToDelete));
      toast.success(`Removed "${skillToDelete}" from ${category}`);
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    skills,
    isDialogOpen,
    selectedCategory,
    newSkill,
    filteredSuggestions,
    isLoading: isLoading || isLoadingTechStack,
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
  };
};
