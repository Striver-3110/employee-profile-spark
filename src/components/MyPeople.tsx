
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TeamMember {
  name: string;
  role: string;
}

interface MyPeopleProps {
  team: string;
  pod: string;
  lead: string;
  buddy: string;
  techAdvisor?: string;
  teamMembers: string[];
  role: string;
}

const MyPeople: React.FC<MyPeopleProps> = ({
  team,
  pod,
  lead,
  buddy,
  techAdvisor,
  teamMembers,
  role
}) => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  
  // Function to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const showTechAdvisor = role === 'tech';
  const showTeamDetails = role !== 'co-founder';

  // Mock team members with roles (in a real app, these would come from the API)
  const teamMembersWithRoles: TeamMember[] = teamMembers.map(name => ({
    name,
    role: name === lead ? "Team Lead" : 
          name === buddy ? "Buddy" :
          name === techAdvisor ? "Tech Advisor" : "Team Member"
  }));

  if (!showTeamDetails) {
    return null; // Don't render anything for co-founders
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>My People</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Team</h3>
            <p className="font-medium">{team}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Pod</h3>
            <p className="font-medium">{pod}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Lead</h3>
            <p className="font-medium">{lead}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Buddy</h3>
            <p className="font-medium">{buddy}</p>
          </div>
          {showTechAdvisor && techAdvisor && (
            <div>
              <h3 className="text-sm text-gray-500">Tech Advisor</h3>
              <p className="font-medium">{techAdvisor}</p>
            </div>
          )}
          <div className="pt-2">
            <Button 
              onClick={() => setShowTeamModal(true)} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <User size={16} />
              <span>View Team</span>
            </Button>
          </div>
        </div>

        {/* Team Members Modal */}
        <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Team Members</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto py-4">
              {teamMembersWithRoles.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MyPeople;
