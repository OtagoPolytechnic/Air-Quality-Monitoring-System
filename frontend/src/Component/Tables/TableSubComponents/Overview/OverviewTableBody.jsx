import React from 'react';
import TableItem from '../TableItem';
import { 
  getCondition, 
  getMinutesSinceLastUpdated, 
  getCO2ColorClass, 
  getTemperatureColorClass,
  getLastUpdatedClass 
} from '../../../../utils/deviceDataProcessing/deviceProcessingFunctions'; // Import utility functions for data processing


const OverviewTableBody = ({ tableFields }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {tableFields.map((item) => { // Iterate through the tableFields array and render each room with sensor data
        const minutesSinceLastUpdated = getMinutesSinceLastUpdated(item.lastUpdated); // Calculate the time since the last update
        const condition = getCondition(item.co2Level, item.temperature); // Gets learning condition based on CO2 levels

        return (
          <tr key={item.dev_eui} className="hover:bg-gray-100 even:bg-gray-50">
              <TableItem item={item.room_number} />
            <td className={`pl-1 py-2 font-medium whitespace-nowrap ${getCO2ColorClass(item.co2Level)}`}>
              {item.co2Level} ppm
            </td>
            <td className={`pl-1 py-2 font-medium text-gray-900 whitespace-nowrap`}>
              {condition}
            </td>
            <td className={`pl-1 py-2 font-medium whitespace-nowrap ${getTemperatureColorClass(item.temperature)}`}>
              {item.temperature}°C
            </td>
            <td className={`pl-1 py-2 font-medium text-gray-900 whitespace-nowrap ${getLastUpdatedClass(minutesSinceLastUpdated)}`}>
              {minutesSinceLastUpdated} minutes ago
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default OverviewTableBody;