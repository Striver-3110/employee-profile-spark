
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

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

  // Map team members with roles
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="col-span-1 sm:col-span-2">
                <h3 className="text-sm text-gray-500">Tech Advisor</h3>
                <p className="font-medium">{techAdvisor}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembersWithRoles.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPeople;
