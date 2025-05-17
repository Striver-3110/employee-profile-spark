
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, User, Edit2, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileHeaderProps {
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ socialLinks: initialSocialLinks }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState<{
    employee_name: string;
    image: string;
    designation: string;
    company_email: string;
    cell_number: string;
    current_address: string;
    name?: string; // Added for employee ID
  } | null>(null);
  const [socialLinks, setSocialLinks] = useState<{platform: string, url: string}[]>(initialSocialLinks);
  const [editingLink, setEditingLink] = useState<{platform: string, url: string, index: number} | null>(null);
  const [newUrl, setNewUrl] = useState('');

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
            name: employee.name || '', // Store employee ID
          });
          
          // Fetch social platform links
          await fetchSocialLinks(employee.name);
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

  const fetchSocialLinks = async (empId: string) => {
    if (!empId) return;
    
    try {
      const response = await fetch(
        `/api/method/one_view.api.links.get_employee_platform_links?employee_id=${encodeURIComponent(empId)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = await response.json();
      
      if (data && data.message) {
        // Transform the API response to match our social links format
        const apiSocialLinks = data.message.map((link: any) => ({
          platform: link.platform_name.toLowerCase(),
          url: link.url
        }));
        
        setSocialLinks(apiSocialLinks);
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
      toast.error('Failed to load social links');
    }
  };

  const updateSocialLink = async (platform: string, link_url: string, index: number) => {
    if (!employee?.name) {
      toast.error('Employee ID is missing');
      return;
    }
    
    try {
      const response = await fetch(`/api/method/one_view.api.links.update_employee_platform_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employee.name,
          platform,
          link_url
        })
      });
      
      const result = await response.json();
      
      if (result && !result.error) {
        // Update the local state with the new URL
        const updatedLinks = [...socialLinks];
        updatedLinks[index] = { ...updatedLinks[index], url: link_url };
        setSocialLinks(updatedLinks);
        toast.success(`Updated ${platform} link`);
      } else {
        toast.error(result.error || 'Failed to update social link');
      }
    } catch (error) {
      console.error('Error updating social link:', error);
      toast.error('Failed to update social link');
    } finally {
      setEditingLink(null);
      setNewUrl('');
    }
  };

  const handleEditLink = (link: {platform: string, url: string}, index: number) => {
    setEditingLink({ ...link, index });
    setNewUrl(link.url);
  };

  const handleSaveLink = () => {
    if (!editingLink) return;
    updateSocialLink(editingLink.platform, newUrl, editingLink.index);
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    setNewUrl('');
  };

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
                    <div key={index} className="flex items-center">
                      {editingLink?.index === index ? (
                        <div className="flex items-center gap-2">
                          <Input 
                            value={newUrl} 
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="h-8 w-40 text-xs"
                          />
                          <Button size="icon" variant="ghost" onClick={handleSaveLink} className="h-6 w-6">
                            <Check size={16} className="text-green-600" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6">
                            <X size={16} className="text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600 transition-colors mr-1"
                          >
                            {getIcon(link.platform)}
                          </a>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleEditLink(link, index)}
                            className="h-5 w-5 ml-1"
                          >
                            <Edit2 size={12} className="text-gray-400 hover:text-gray-600" />
                          </Button>
                        </>
                      )}
                    </div>
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
