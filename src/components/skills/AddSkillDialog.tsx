
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogComponent } from '../ui/dialog-content';

interface AddSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (skill: string) => void;
  isLoading: boolean;
  isTechRole: boolean;
  title: string;
  description: string;
  filteredSuggestions: string[];
  onInputChange: (value: string) => void;
  onSelectSuggestion: (suggestion: string) => void;
  skillInput: string;
}

const AddSkillDialog: React.FC<AddSkillDialogProps> = ({
  isOpen,
  onClose,
  onAddSkill,
  isLoading,
  isTechRole,
  title,
  description,
  filteredSuggestions,
  onInputChange,
  onSelectSuggestion,
  skillInput
}) => {
  return (
    <DialogComponent
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="relative">
          <Input
            placeholder={isTechRole ? "e.g. React, Python, AWS" : "e.g. Project Management, UX Research"}
            value={skillInput}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isLoading}
          />
          
          {filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full max-h-60 overflow-y-auto mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={() => onAddSkill(skillInput)} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </DialogComponent>
  );
};

export default AddSkillDialog;
