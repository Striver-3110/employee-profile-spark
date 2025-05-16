
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  image: string;
  designation: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  image,
  designation,
  email,
  phone,
  address,
  socialLinks,
}) => {
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
          <Avatar className="w-24 h-24">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center md:items-start flex-grow">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-500 mb-4">{designation}</p>
            
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
          </div>
          
          <div className="flex flex-col gap-2 text-sm mt-4 md:mt-0">
            {email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <a href={`mailto:${email}`} className="hover:text-blue-600 transition-colors">{email}</a>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <a href={`tel:${phone}`} className="hover:text-blue-600 transition-colors">{phone}</a>
              </div>
            )}
            
            {address && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
