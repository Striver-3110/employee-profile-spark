
import { toast } from "sonner";

export interface EmployeeResponse {
  name: string;
  employee_name: string;
  image: string;
  designation: string;
  company_email: string;
  cell_number: string;
  current_address: string;
  date_of_joining: string;
  custom_about: string;
  custom_tech_stack: {
    name: string;
    skill: string;
    proficiency_level: string;
  }[];
  custom_passionate_about: {
    name: string;
    passionate_about: string;
  }[];
  custom_platforms: {
    name: string;
    platform_name: string;
    url: string;
  }[];
  custom_employee_icebreaker_question: {
    name: string;
    question: string;
    answer: string;
  }[];
  custom_project: {
    title: string;
    name: string;
    expected_start_date: string;
    expected_end_date: string | null;
    status: string;
    project_link: string;
    description: string;
  }[];
  custom_team: string;
  custom_pod: string;
  custom_tech_lead: string;
  custom_buddy: string;
  custom_tech_advisor: string;
}

// Global cache for employee data
let cachedEmployeeData: EmployeeResponse | null = null;

export const fetchEmployeeDetails = async (): Promise<EmployeeResponse> => {
  try {
    // Return cached data if available
    if (cachedEmployeeData) {
      return cachedEmployeeData;
    }
    
    const response = await fetch('/api/method/one_view.api.user.get_employee_details', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee details');
    }

    const data = await response.json();
    
    if (!data.message) {
      throw new Error('Invalid employee data received');
    }
    
    // Cache the response
    cachedEmployeeData = data.message;
    return data.message;
  } catch (error) {
    console.error('Error fetching employee details:', error);
    toast.error('Failed to load employee details');
    throw error;
  }
};

export const fetchSocialLinks = async (employeeId: string) => {
  try {
    const response = await fetch(
      `/api/method/one_view.api.links.get_employee_platform_links?employee_id=${encodeURIComponent(employeeId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch social links');
    }
    
    const data = await response.json();
    
    if (data && data.message) {
      return data.message.map((link: any) => ({
        platform: link.platform_name.toLowerCase(),
        url: link.url
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch social links:', error);
    toast.error('Failed to load social links');
    throw error;
  }
};

export const updateSocialLink = async (employeeId: string, platform: string, link_url: string) => {
  try {
    const response = await fetch(`/api/method/one_view.api.links.update_employee_platform_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_id: employeeId,
        platform,
        link_url
      })
    });
    
    const result = await response.json();
    
    if (result && !result.error) {
      toast.success(`Updated ${platform} link`);
      return result;
    } else {
      toast.error(result.error || 'Failed to update social link');
      throw new Error(result.error || 'Failed to update social link');
    }
  } catch (error) {
    console.error('Error updating social link:', error);
    toast.error('Failed to update social link');
    throw error;
  }
};

export const fetchProjects = async (employeeId: string) => {
  try {
    const response = await fetch(`/api/method/one_view.api.project.get_employee_projects?employee_id=${encodeURIComponent(employeeId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data = await response.json();
    
    // Map returned projects to our interface format
    const projectsData = data.message.map((project: any) => ({
      id: project.name,
      name: project.name,
      title: project.title,
      expected_start_date: project.expected_start_date,
      expected_end_date: project.expected_end_date,
      status: project.status,
      project_link: project.project_link,
      description: project.description
    }));
    
    // Sort projects by start date in descending order (most recent first)
    return [...projectsData].sort((a, b) => {
      return new Date(b.expected_start_date).getTime() - new Date(a.expected_start_date).getTime();
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('Failed to load career progression data');
    throw error;
  }
};
