
import { toast } from "sonner";

export interface Skill {
  skill: string;
  category: string;
}

export interface SkillsByCategory {
  expert: string[];
  intermediate: string[];
  beginner: string[];
  learning: string[];
}

// API functions
export const fetchEmployeeSkills = async (employeeId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/method/one_view.api.tech_stack.get_employee_tech_stack?employee_id=${encodeURIComponent(employeeId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch skills data');
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching skills data:', error);
    throw error;
  }
};

export const addSkill = async (employeeId: string, skill: string, category: string): Promise<void> => {
  const response = await fetch("/api/method/one_view.api.tech_stack.add_tech_stack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employee_id: employeeId,
      skill: skill,
      category: category
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to add skill");
  }
};

export const removeSkill = async (employeeId: string, skill: string, category: string): Promise<void> => {
  const response = await fetch("/api/method/one_view.api.tech_stack.remove_tech_stack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employee_id: employeeId,
      skill: skill,
      category: category
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to remove skill");
  }
};

export const formatSkillsData = (techStackData: any[]): SkillsByCategory => {
  return {
    expert: techStackData.filter((skill) => skill.category === 'expert').map((skill) => skill.skill),
    intermediate: techStackData.filter((skill) => skill.category === 'intermediate').map((skill) => skill.skill),
    beginner: techStackData.filter((skill) => skill.category === 'beginner').map((skill) => skill.skill),
    learning: techStackData.filter((skill) => skill.category === 'learning').map((skill) => skill.skill),
  };
};

export const getAllSkills = (skills: SkillsByCategory): string[] => {
  return [...skills.expert, ...skills.intermediate, ...skills.beginner, ...skills.learning];
};
