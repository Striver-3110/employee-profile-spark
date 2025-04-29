
import { format, differenceInMonths } from 'date-fns';

// Mock data for the employee profile
export const employeeData = {
  id: 1,
  name: "Alex Johnson",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop",
  designation: "Senior Software Engineer",
  role: "tech", // tech, non-tech, co-founder
  about: "Passionate software engineer with over 5 years of experience in building scalable web applications. Focused on frontend technologies and design systems. Love to mentor junior developers and contribute to open-source projects.",
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com/in/alexjohnson" },
    { platform: "github", url: "https://github.com/alexjohnson" },
    { platform: "twitter", url: "https://twitter.com/alexjohnson" }
  ],
  joinedDate: "2021-06-15",
  creativePursuits: [
    "Photography",
    "Playing Guitar",
    "Mountain Hiking",
    "Cooking Italian Food"
  ],
  icebreakers: [
    { question: "If you could have dinner with anyone, who would it be?", answer: "Nikola Tesla, to discuss his unrealized inventions." },
    { question: "What's your go-to karaoke song?", answer: "Don't Stop Believin' by Journey" },
    { question: "If you were a superhero, what would your power be?", answer: "Teleportation, to avoid traffic and visit places instantly." }
  ],
  people: {
    team: "Frontend Development",
    pod: "User Experience",
    lead: "Sarah Thompson",
    buddy: "Michael Chen",
    techAdvisor: "Dr. Rachel Kim",
    teamMembers: ["Michael Chen", "Priya Patel", "James Wilson", "Emma Garcia"]
  },
  skills: {
    expert: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"],
    intermediate: ["Node.js", "GraphQL", "AWS", "Docker"],
    beginner: ["Python", "React Native"],
    learning: ["Rust", "WebAssembly"]
  },
  progression: [
    { 
      projectName: "Customer Dashboard Redesign", 
      role: "Frontend Lead", 
      startDate: "2023-01-10", 
      endDate: null, 
      current: true 
    },
    { 
      projectName: "Mobile App Development", 
      role: "Senior Developer", 
      startDate: "2022-03-15", 
      endDate: null, 
      current: true 
    },
    { 
      projectName: "E-commerce Platform", 
      role: "Software Engineer", 
      startDate: "2021-06-15", 
      endDate: "2022-03-01", 
      current: false 
    }
  ],
  feedback: {
    givenByMe: [
      { recipient: "Priya Patel", date: "2023-09-15", summary: "Outstanding work on the authentication system" }
    ],
    givenToMe: [
      { from: "Sarah Thompson", date: "2023-10-05", summary: "Excellent leadership on the dashboard project" },
      { from: "Dr. Rachel Kim", date: "2023-07-20", summary: "Great problem-solving skills demonstrated in the recent sprint" }
    ],
    pendingToGive: [
      { recipient: "James Wilson", dueDate: "2023-11-30", context: "Q3 Performance Review" }
    ]
  },
  calibration: {
    performancePotentialGrid: {
      performance: "high", // low, medium, high
      potential: "high" // low, medium, high
    },
    skillLevels: [
      { skill: "Technology", level: 2 },
      { skill: "Craft Code", level: 3 },
      { skill: "Communication", level: 2 },
      { skill: "Mentoring", level: 3 },
      { skill: "Learning, Sharing and Community", level: 0 },
      { skill: "Represents and Contributes to Incubyte's Growth", level: 0 },
      { skill: "Tooling", level: 0 },
      { skill: "Technical Practices", level: 2 },
      { skill: "Overall Level", level: 2 }
    ]
  }
};

// Pre-defined list for skill suggestions
export const skillSuggestions = {
  tech: ["JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", "Java", "C#", "Ruby", "Go", "Rust", "PHP", "Swift", "Kotlin", "HTML", "CSS", "Sass", "GraphQL", "REST API", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Git", "CI/CD", "DevOps", "Test Automation", "Agile", "Scrum"],
  nonTech: ["Project Management", "Product Design", "UX Research", "UI Design", "Content Strategy", "Digital Marketing", "SEO", "Data Analysis", "Business Development", "Client Relationship", "Team Leadership", "Agile Methods", "Stakeholder Management", "Presentation", "Documentation", "Budgeting", "Resource Planning", "Risk Management", "Strategic Planning", "Process Optimization"]
};

// Helper function to calculate tenure
export const calculateTenure = (joinedDate: string): string => {
  const today = new Date();
  const joined = new Date(joinedDate);
  
  const totalMonths = differenceInMonths(today, joined);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  } else {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
};

// Helper function to format dates
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM dd, yyyy');
};
