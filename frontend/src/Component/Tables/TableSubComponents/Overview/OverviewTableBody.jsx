import React from 'react';
import TableItem from '../TableItem';


const OverviewTableBody = ({ tableFields }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {tableFields.map((item) => { // Iterate through the tableFields array and render each room with sensor data
        const minutesSinceLastUpdated = getMinutesSinceLastUpdated(item.lastUpdated); // Calculate the time since the last update
        const condition = getCondition(item.co2Level); // Gets learning condition based on CO2 levels

        return (
          <tr key={item.dev_eui} className="hover:bg-gray-100 even:bg-gray-50">
              <TableItem item={item.room_number} />
            <td className={`pl-1 py-2 font-medium whitespace-nowrap ${getCO2ColorClass(item.co2Level)}`}>
              {item.co2Level} ppm
            </td>
            <td className={`pl-1 py-2 font-medium text-gray-900 whitespace-nowrap`}>
              {condition}
            </td>
            <td className="pl-1 py-2 font-medium text-gray-900 whitespace-nowrap">
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

// Function to determine the condition of CO2 levels on learning from Liz CO2 research
const getCondition = (co2Level) => {
  if (!co2Level) return 'No data';
  if (co2Level < 400) return 'Great learning environment';
  if (co2Level < 1000) return 'Good learning environment';
  if (co2Level < 2000) return 'Drowsiness, reduced focus';
  if (co2Level < 5000) return 'Drowsiness, headaches, poor concentration';
  return 'Unsafe, inability to learn effectively';
}

// Function to calculate the minutes since the last update
const getMinutesSinceLastUpdated = (lastUpdated) => {
  const currentTime = new Date();
  const lastUpdatedTime = new Date(lastUpdated);
  const timeDifference = Math.abs(currentTime - lastUpdatedTime) / (1000 * 60); 
  return Math.floor(timeDifference);
};

// Function to determine the color class based on CO2 levels
const getCO2ColorClass = (co2Level) => {
  if (!co2Level) return 'text-gray-900';
  if (co2Level < 1000) return 'text-green-600';
  if (co2Level < 2000) return 'text-yellow-600';
  return 'text-red-600';
};

// Function to determine the color class based on last updated time
const getLastUpdatedClass = (minutesSinceLastUpdated) => {
  if (minutesSinceLastUpdated < 10) return 'text-green-600';
  if (minutesSinceLastUpdated < 15) return 'text-yellow-600';
  return 'text-red-600';
};

export default OverviewTableBody;