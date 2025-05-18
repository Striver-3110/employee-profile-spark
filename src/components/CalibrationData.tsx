
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

interface CalibrationProps {
  performancePotentialGrid: {
    performance: string; // Changed to string to match the context/employee data
    potential: string;   // Changed to string to match the context/employee data
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

  // 9-box grid labels
  const potentialLabels = ['Low Potential', 'Moderate Potential', 'High Potential'];
  const performanceLabels = ['Low Performance', 'Solid Performance', 'High Performance'];

  // Grid cell descriptions
  const gridDescriptions = [
    ['Underperformer', 'Potential Risk', 'Enigma'],
    ['Value Player', 'Core Player', 'High Potential'],
    ['Specialized Expert', 'Consistent Star', 'Top Talent']
  ];

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle>Thrive 360</CardTitle>
        <div className="text-sm text-muted-foreground">Last updated on: {formattedDate}</div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 9-Box Grid using CSS grid */}
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium mb-4 text-blue-800">Performance & Potential Matrix</h3>
            <div className="relative">
              {/* Grid layout */}
              <div className="grid grid-cols-3 grid-rows-3 gap-1 border border-gray-200 rounded-md p-1 bg-gray-50">
                {[...Array(9)].map((_, index) => {
                  const gridRow = Math.floor(index / 3);
                  const gridCol = index % 3;
                  const isSelected = gridRow === 2 - row && gridCol === col;
                  
                  return (
                    <div 
                      key={index} 
                      className={`
                        flex flex-col items-center justify-center p-2 h-20 text-center
                        ${isSelected ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-white border border-gray-200'}
                        ${gridRow === 2 ? 'bg-opacity-70 bg-green-50' : ''}
                        ${gridRow === 1 ? 'bg-opacity-70 bg-yellow-50' : ''}
                        ${gridRow === 0 ? 'bg-opacity-70 bg-red-50' : ''}
                        transition-all hover:shadow-sm
                      `}
                    >
                      <span className="text-xs font-medium">
                        {gridDescriptions[gridRow][gridCol]}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Performance axis (vertical) */}
              <div className="absolute -left-24 top-0 h-full flex flex-col justify-between items-end">
                {performanceLabels.map((label, index) => (
                  <div key={index} className="text-xs text-gray-600 pr-2">{label}</div>
                ))}
              </div>
              
              {/* Potential axis (horizontal) */}
              <div className="absolute top-full left-0 w-full flex justify-between mt-2">
                {potentialLabels.map((label, index) => (
                  <div key={index} className="text-xs text-gray-600">{label}</div>
                ))}
              </div>
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
