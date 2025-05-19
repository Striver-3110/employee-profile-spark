
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, User, Edit2, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchSocialLinks, updateSocialLink } from '@/services/api';
import { useEmployee } from "@/contexts/EmployeeContext";

interface ProfileHeaderProps {
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ socialLinks: initialSocialLinks = [] }) => {
  const { employee, employeeId, isLoading: contextIsLoading } = useEmployee();
  const [socialLinks, setSocialLinks] = useState<{platform: string, url: string}[]>(initialSocialLinks);
  const [editingLink, setEditingLink] = useState<{platform: string, url: string, index: number} | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isLoadingSocialLinks, setIsLoadingSocialLinks] = useState(false);

  useEffect(() => {
    const loadSocialLinks = async () => {
      if (!employeeId) return;
      
      try {
        setIsLoadingSocialLinks(true);
        const links = await fetchSocialLinks(employeeId);
        setSocialLinks(links);
      } catch (error) {
        console.error('Error loading social links:', error);
      } finally {
        setIsLoadingSocialLinks(false);
      }
    };

    loadSocialLinks();
  }, [employeeId]);

  const handleUpdateSocialLink = async (platform: string, link_url: string, index: number) => {
    if (!employeeId) {
      toast.error('Employee ID is missing');
      return;
    }
    
    try {
      await updateSocialLink(employeeId, platform, link_url);
      
      // Update the local state with the new URL
      const updatedLinks = [...socialLinks];
      updatedLinks[index] = { ...updatedLinks[index], url: link_url };
      setSocialLinks(updatedLinks);
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
    handleUpdateSocialLink(editingLink.platform, newUrl, editingLink.index);
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
  
  const isLoading = contextIsLoading || isLoadingSocialLinks;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {isLoading ? (
            <Skeleton className="w-24 h-24 rounded-full" />
          ) : (
            <Avatar className="w-24 h-24">
              <AvatarImage src={employee?.image} alt={employee?.name} />
              <AvatarFallback>{employee?.name ? getInitials(employee.name) : <User />}</AvatarFallback>
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
                <h1 className="text-2xl font-bold">{employee?.name}</h1>
                <p className="text-gray-500 mb-4">{employee?.role}</p>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center group relative">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {getIcon(link.platform)}
                      </a>
                      
                      {/* Edit button as small icon that appears on hover */}
                      {!editingLink && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleEditLink(link, index)}
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-3 -top-2"
                        >
                          <Edit2 size={10} className="text-gray-400 hover:text-gray-600" />
                        </Button>
                      )}
                      
                      {editingLink?.index === index && (
                        <div className="flex items-center gap-1 ml-2">
                          <Input 
                            value={newUrl} 
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="h-7 w-36 text-xs"
                          />
                          <div className="flex">
                            <Button size="icon" variant="ghost" onClick={handleSaveLink} className="h-6 w-6">
                              <Check size={14} className="text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6">
                              <X size={14} className="text-red-600" />
                            </Button>
                          </div>
                        </div>
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
                {employee?.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <a href={`mailto:${employee.email}`} className="hover:text-blue-600 transition-colors">
                      {employee.email}
                    </a>
                  </div>
                )}
                
                {employee?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <a href={`tel:${employee.phone}`} className="hover:text-blue-600 transition-colors">
                      {employee.phone}
                    </a>
                  </div>
                )}
                
                {employee?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span>{employee.address}</span>
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
