
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  if (!showTeamDetails) {
    return null; // Don't render anything for co-founders
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>My People</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div>
            <h3 className="text-sm text-gray-500 mb-2">Team Members</h3>
            <div className="flex flex-wrap gap-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Avatar className="mb-1">
                    <AvatarFallback>{getInitials(member)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyPeople;
