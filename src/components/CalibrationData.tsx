
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalibrationProps {
  performancePotentialGrid: {
    performance: string; // low, medium, high
    potential: string; // low, medium, high
  };
  skillLevels: {
    skill: string;
    level: number;
  }[];
}

const CalibrationData: React.FC<CalibrationProps> = ({ performancePotentialGrid, skillLevels }) => {
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
  
  // Labels for the 9-grid
  const performanceLabels = ["Low", "Medium", "High"];
  const potentialLabels = ["Low", "Medium", "High"];
  
  // Generate skill level bar width percentage
  const getSkillLevelWidth = (level: number) => {
    return `${(level / 5) * 100}%`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance & Skills Calibration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 9-Box Grid */}
          <div>
            <h3 className="font-medium mb-4">Performance & Potential Matrix</h3>
            <div className="relative">
              {/* Y-axis label */}
              <div className="absolute -left-24 top-1/2 transform -rotate-90 -translate-y-1/2 text-sm text-gray-500">
                Performance
              </div>
              
              {/* X-axis label */}
              <div className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
                Potential
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-1">
                {potentialLabels.map((label, index) => (
                  <div key={index} className="text-center text-xs text-gray-500">{label}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-[auto_1fr] gap-1">
                <div className="flex flex-col justify-between pr-1">
                  {performanceLabels.map((label, index) => (
                    <div key={index} className="text-xs text-gray-500 h-12 flex items-center">
                      {label}
                    </div>
                  )).reverse() /* Reverse to show High at the top */}
                </div>
                
                <div className="grid grid-rows-3 grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const gridRow = Math.floor(index / 3);
                    const gridCol = index % 3;
                    const isHighlighted = 2 - gridRow === row && gridCol === col;
                    
                    return (
                      <div 
                        key={index} 
                        className={`h-12 rounded flex items-center justify-center
                          ${isHighlighted 
                            ? 'bg-blue-500 text-white font-medium' 
                            : 'bg-gray-100 text-gray-400'}
                        `}
                      >
                        {isHighlighted && '●'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Skill Levels */}
          <div>
            <h3 className="font-medium mb-4">Skill Calibration Levels</h3>
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
                    <tr key={index} className="border-t">
                      <td className="py-3 pr-4">{skillLevel.skill}</td>
                      <td className="py-3 w-1/2">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: getSkillLevelWidth(skillLevel.level) }}
                            />
                          </div>
                          <span className="text-sm">
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
