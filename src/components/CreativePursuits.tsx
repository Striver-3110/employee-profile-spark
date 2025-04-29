
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { DialogComponent } from './ui/dialog-content';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface CreativePursuitsProps {
  pursuits: string[];
  onUpdate: (pursuits: string[]) => void;
  isLoading?: boolean;
}

const CreativePursuits: React.FC<CreativePursuitsProps> = ({ pursuits, onUpdate, isLoading = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPursuit, setNewPursuit] = useState('');
  
  const handleAddPursuit = () => {
    if (!newPursuit.trim()) {
      toast.error("Please enter a valid pursuit");
      return;
    }
    
    const updatedPursuits = [...pursuits, newPursuit.trim()];
    onUpdate(updatedPursuits);
    setNewPursuit('');
    setIsDialogOpen(false);
    toast.success("Creative pursuit added successfully!");
  };
  
  const handleRemovePursuit = (index: number) => {
    const updatedPursuits = pursuits.filter((_, i) => i !== index);
    onUpdate(updatedPursuits);
    toast.success("Creative pursuit removed successfully!");
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-20" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle>Creative Pursuits</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="bg-white hover:bg-gray-100">
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {pursuits.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pursuits.map((pursuit, index) => (
              <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 shadow-sm">
                <span className="font-medium">{pursuit}</span>
                <button 
                  onClick={() => handleRemovePursuit(index)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No creative pursuits added yet.</p>
        )}
      </CardContent>
      
      <DialogComponent
        title="Add Creative Pursuit"
        description="What are you passionate about outside of work?"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <div className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="e.g. Photography, Music, Cooking"
            value={newPursuit}
            onChange={(e) => setNewPursuit(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPursuit}>Add</Button>
          </div>
        </div>
      </DialogComponent>
    </Card>
  );
};

export default CreativePursuits;
