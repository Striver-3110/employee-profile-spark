
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

interface CalibrationProps {
  performancePotentialGrid: {
    performance: string; // low, medium, high
    potential: string; // low, medium, high
  };
  skillLevels: {
    skill: string;
    level: number;
  }[];
  lastUpdated?: Date; // Optional date when the calibration was last updated
}

const CalibrationData: React.FC<CalibrationProps> = ({ 
  performancePotentialGrid, 
  skillLevels,
  lastUpdated = new Date() // Default to current date if not provided
}) => {
  // Get position in 9-grid
  const getGridPosition = () => {
    const { performance, potential } = performancePotentialGrid;
    
    const positionMap: { [key: string]: number } = {
      'low': 0,
      'medium': 1,
      'high': 2
    };
    
    const row = positionMap[performance];
    const col = positionMap[potential];
    
    return { row, col };
  };

  const { row, col } = getGridPosition();
  const formattedDate = format(lastUpdated, 'MMMM dd, yyyy');
  
  // Generate skill level bar width percentage
  const getSkillLevelWidth = (level: number) => {
    return `${(level / 5) * 100}%`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle>Thrive 360</CardTitle>
        <div className="text-sm text-muted-foreground">Last updated on: {formattedDate}</div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 9-Box Grid using image */}
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium mb-4 text-blue-800">Performance & Potential Matrix</h3>
            <div className="relative">
              <img 
                src="/lovable-uploads/ce35a4bd-9e44-498a-82a3-dd40b9261d93.png" 
                alt="9-box performance and potential grid" 
                className="w-full h-auto rounded-md shadow-sm" 
              />
              <div className="absolute" style={{
                top: `${33.3 * (2 - row)}%`, 
                left: `${33.3 * col}%`,
                width: '33.3%',
                height: '33.3%',
                border: '3px solid #4F46E5',
                borderRadius: '4px',
                pointerEvents: 'none'
              }} />
            </div>
          </div>
          
          {/* Skill Levels */}
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium mb-4 text-blue-800">Skill Calibration Levels</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-sm text-gray-500 pb-2">Skill</th>
                    <th className="text-left font-medium text-sm text-gray-500 pb-2">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {skillLevels.map((skillLevel, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-3 pr-4">{skillLevel.skill}</td>
                      <td className="py-3 w-1/2">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-indigo-600 h-2.5 rounded-full" 
                              style={{ width: getSkillLevelWidth(skillLevel.level) }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {skillLevel.level > 0 ? `L${skillLevel.level}` : 'L0'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalibrationData;
