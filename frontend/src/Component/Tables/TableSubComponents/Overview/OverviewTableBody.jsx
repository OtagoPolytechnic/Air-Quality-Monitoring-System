import React from 'react';
import { 
  getCondition, 
  getMinutesSinceLastUpdated, 
  getLastUpdatedClass,
  getBadgeColorClass 
} from '../../../../utils/deviceDataProcessing/deviceProcessingFunctions';

const OverviewTableBody = ({ tableFields }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {tableFields.map((item) => { // Iterate through the tableFields array and render each room with sensor data
        const minutesSinceLastUpdated = getMinutesSinceLastUpdated(item.lastUpdated); // Calculate the time since the last update
        const condition = getCondition(item.co2Level, item.temperature); // Gets learning condition based on CO2 and temp levels
        const badgeColorClass = getBadgeColorClass(item.co2Level, item.temperature); // Get the badge color class based on CO2 and temperature levels

        return (
          <tr key={item.dev_eui} className="hover:bg-gray-100 even:bg-gray-50">
            <td className="w-[15%] pl-4 py-2 font-bold text-black text-lg whitespace-nowrap">
              {item.room_number}
            </td>
            <td className="w-[15%] pl-1 py-2 font-medium whitespace-nowrap text-gray-900">
              {item.co2Level} ppm
            </td>
            <td className="w-[15%] pl-1 py-2 font-medium whitespace-nowrap text-gray-900">
              {item.temperature}°C
            </td>
            <td className="w-[25%] pl-1 py-2 whitespace-nowrap">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badgeColorClass}`}>
                {condition}
              </span>
            </td>
            <td className={`w-[30%] pl-1 pr-4 py-2 font-medium text-gray-900 whitespace-nowrap text-right ${getLastUpdatedClass(minutesSinceLastUpdated)}`}>
              {minutesSinceLastUpdated} minutes ago
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default OverviewTableBody;