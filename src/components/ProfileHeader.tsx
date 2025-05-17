
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ProfileHeaderProps {
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ socialLinks }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState<{
    employee_name: string;
    image: string;
    designation: string;
    company_email: string;
    cell_number: string;
    current_address: string;
  } | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await fetch('/api/method/one_view.api.user.get_employee_details', {
          headers: { 'Content-Type': 'application/json' },
        });

        const userData = await userResponse.json();

        if (!userData.message) throw new Error('No user data received');

        // Get employee associated with user
        const employeeData = userData;

        if (employeeData && employeeData.message) {
          const employee = employeeData.message;
          setEmployee({
            employee_name: employee.employee_name || 'Unknown Employee',
            image: employee.image || '',
            designation: employee.designation || 'Staff',
            company_email: employee.company_email || '',
            cell_number: employee.cell_number || '',
            current_address: employee.current_address || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
        toast.error('Failed to load employee profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  // Function to get the appropriate icon based on platform
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'github':
        return <Github size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      default:
        return null;
    }
  };

  // Extract initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {isLoading ? (
            <Skeleton className="w-24 h-24 rounded-full" />
          ) : (
            <Avatar className="w-24 h-24">
              <AvatarImage src={employee?.image} alt={employee?.employee_name} />
              <AvatarFallback>{employee?.employee_name ? getInitials(employee.employee_name) : <User />}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col items-center md:items-start flex-grow">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{employee?.employee_name}</h1>
                <p className="text-gray-500 mb-4">{employee?.designation}</p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {getIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-2 text-sm mt-4 md:mt-0">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-5 w-40" />
              </>
            ) : (
              <>
                {employee?.company_email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <a href={`mailto:${employee.company_email}`} className="hover:text-blue-600 transition-colors">
                      {employee.company_email}
                    </a>
                  </div>
                )}
                
                {employee?.cell_number && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <a href={`tel:${employee.cell_number}`} className="hover:text-blue-600 transition-colors">
                      {employee.cell_number}
                    </a>
                  </div>
                )}
                
                {employee?.current_address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span>{employee.current_address}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
