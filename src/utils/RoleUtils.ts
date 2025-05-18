
// Utility to determine role group based on employee role
export const getRoleGroup = (role: string): string => {
  const technicalRoles = [
    'Software Craftsperson', 
    'Software Craftsperson - Tech Lead', 
    'Software Craftsperson - Tech Advisor',
    'AI Craftsperson',
    'Test Craftsperson',
    'Test Craftsperson (Manual)',
    'Test Craftsperson (Automation)',
    'BQA',
    'Intern',
    'tech' // For backward compatibility
  ];
  
  const designProductRoles = [
    'Product Craftsperson',
    'Product Kick-off Specialist',
    'Product Manager',
    'Product Analyst',
    'Product Manager - Guild Lead',
    'UI/UX Craftsperson',
    'Content Manager'
  ];
  
  const peopleOpsRoles = [
    'People Success Manager',
    'People Success Specialist',
    'Talent Acquisition Specialist'
  ];
  
  const opsStrategyRoles = [
    'Operations Manager',
    'Executive Assistant',
    'Operation Head'
  ];
  
  const financeAdminRoles = ['Accountant'];
  
  const leadershipRoles = [
    'Engineer Manager',
    'Co-Founder',
    'Technical Program Manager',
    'co-founder' // For backward compatibility
  ];
  
  if (technicalRoles.includes(role)) return 'Technical Roles';
  if (designProductRoles.includes(role)) return 'Design & Product';
  if (peopleOpsRoles.includes(role)) return 'People Operations';
  if (opsStrategyRoles.includes(role)) return 'Operations & Strategy';
  if (financeAdminRoles.includes(role)) return 'Finance & Admin';
  if (leadershipRoles.includes(role)) return 'Leadership / Founders';
  
  return 'Other Roles';
};
