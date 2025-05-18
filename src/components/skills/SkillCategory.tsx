
import React, { useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, Move } from "lucide-react";

interface SkillCategoryProps {
  title: string;
  category: string;
  skills: string[];
  isLoading: boolean;
  onOpenDialog: (category: string) => void;
  onDragStart: (skill: string, category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (category: string, e: React.DragEvent) => void;
  onDelete: (category: string, skill: string) => void;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({
  title,
  category,
  skills,
  isLoading,
  onOpenDialog,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete
}) => {
  const dropRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 capitalize">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onOpenDialog(category)}
          disabled={isLoading}
        >
          <Plus size={16} />
        </Button>
      </div>
      <div 
        ref={dropRef}
        className={`flex flex-wrap gap-2 min-h-[60px] p-2 border border-dashed ${isLoading ? 'bg-gray-50' : 'bg-transparent'} border-gray-300 rounded-md`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(category, e)}
      >
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading skills...</p>
        ) : skills.length > 0 ? (
          skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`bg-gray-100 group relative cursor-move flex items-center gap-1 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              draggable={!isLoading}
              onDragStart={() => onDragStart(skill, category)}
            >
              <Move size={12} className="text-gray-500 mr-1" />
              {skill}
              <button 
                onClick={() => onDelete(category, skill)}
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
};

export default SkillCategory;
