
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AboutMeProps {
  about: string;
  isLoading?: boolean;
  onUpdate?: (newAbout: string) => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ about, isLoading = false, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedAbout);
      toast.success("About Me updated successfully");
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle>About Me</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </CardHeader>
      <CardContent>
        {about ? (
          <p className="whitespace-pre-wrap">{about}</p>
        ) : (
          <p className="text-gray-500 italic">Tell us about yourself...</p>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit About Me</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editedAbout}
              onChange={(e) => setEditedAbout(e.target.value)}
              placeholder="Write something about yourself..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AboutMe;
