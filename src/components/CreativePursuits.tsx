
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { DialogComponent } from './ui/dialog-content';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CreativePursuitsProps {
  pursuits?: string[];
  onUpdate?: (pursuits: string[]) => void;
  isLoading?: boolean;
  employeeId?: string;
}

interface Passion {
  id?: string;
  name: string;
}

const CreativePursuits: React.FC<CreativePursuitsProps> = ({ 
  pursuits: initialPursuits, 
  onUpdate, 
  isLoading: propIsLoading = false,
  employeeId = "Alex Johnson" 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPursuit, setNewPursuit] = useState('');
  const [passions, setPassions] = useState<Passion[]>([]);
  const queryClient = useQueryClient();
  
  // Fetch passions using React Query
  const { isLoading: isLoadingPassions, error: passionError } = useQuery({
    queryKey: ['passions', employeeId],
    queryFn: async () => {
      const response = await fetch('/api/method/one_view.api.employee.get_employee_passions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: employeeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch passionate about data');
      }

      const result = await response.json();
      if (result.message && Array.isArray(result.message)) {
        setPassions(result.message);
        return result.message;
      }
      return [];
    },
    retry: 1,
  });

  // Add passion mutation
  const addPassionMutation = useMutation({
    mutationFn: async (passion: string) => {
      // Create a temporary item with a unique ID to show optimistic UI
      const tempId = `temp-${Date.now()}`;
      const tempPassion = { id: tempId, name: passion };
      
      // Optimistic update
      setPassions(prev => [...prev, tempPassion]);
      
      // Make the API call
      const response = await fetch('/api/method/one_view.api.employee.update_employee_passion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          passion,
          action: 'add'
        }),
      });

      if (!response.ok) {
        // Remove the temporary item if request fails
        setPassions(passions.filter(p => p.id !== tempId));
        throw new Error('Failed to add passion');
      }

      const result = await response.json();
      
      if (result.message && result.message.success) {
        // Fix: Ensure we're returning a valid name string for the updated passion
        setPassions(prevPassions => 
          prevPassions.map(p => 
            p.id === tempId ? { id: p.id, name: passion } : p
          )
        );
        return result;
      }
      
      throw new Error('Unexpected response format');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passions', employeeId] });
      toast.success("Creative pursuit added successfully!");
      setNewPursuit('');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to add pursuit'}`);
    }
  });

  // Remove passion mutation
  const removePassionMutation = useMutation({
    mutationFn: async (passion: string) => {
      // Optimistic update
      const previousPassions = [...passions];
      setPassions(passions.filter(p => p.name !== passion));
      
      try {
        const response = await fetch('/api/method/one_view.api.employee.update_employee_passion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: employeeId,
            passion,
            action: 'delete'
          }),
        });

        if (!response.ok) {
          // Revert to previous state
          setPassions(previousPassions);
          throw new Error('Failed to remove passion');
        }

        return await response.json();
      } catch (error) {
        // Revert to previous state
        setPassions(previousPassions);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passions', employeeId] });
      toast.success("Creative pursuit removed successfully!");
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to remove pursuit'}`);
    }
  });

  const handleAddPursuit = () => {
    if (!newPursuit.trim()) {
      toast.error("Please enter a valid pursuit");
      return;
    }
    
    addPassionMutation.mutate(newPursuit.trim());
  };
  
  const handleRemovePursuit = (passion: string) => {
    removePassionMutation.mutate(passion);
  };

  const isLoading = propIsLoading || isLoadingPassions || addPassionMutation.isPending || removePassionMutation.isPending;

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

  if (passionError) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Creative Pursuits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading pursuits. Please try again later.</p>
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
        {passions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {passions.map((passion, index) => (
              <div key={passion.id || index} className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 shadow-sm">
                <span className="font-medium">{passion.name}</span>
                <button 
                  onClick={() => handleRemovePursuit(passion.name)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  disabled={removePassionMutation.isPending}
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
            <Button 
              onClick={handleAddPursuit}
              disabled={addPassionMutation.isPending || !newPursuit.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogComponent>
    </Card>
  );
};

export default CreativePursuits;
