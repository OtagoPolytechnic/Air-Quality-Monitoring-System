import React from 'react';
import TableItem from '../TableItem';


const OverviewTableBody = ({ tableFields }) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {tableFields.map((item) => {
        const minutesSinceLastUpdated = getMinutesSinceLastUpdated(item.lastUpdated);
        const impact = getImpact(item.co2Level);

        return (
          <tr key={item.dev_eui} className="hover:bg-gray-100 even:bg-gray-50">
              <TableItem item={item.room_number} />
            <td className={`pl-1 py-2 font-medium whitespace-nowrap ${getCO2ColorClass(item.co2Level)}`}>
              {item.co2Level} ppm
            </td>
            <td className={`pl-1 py-2 font-medium text-gray-900 whitespace-nowrap`}>
              {impact}
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


const getImpact = (co2Level) => {
  if (!co2Level) return 'No data';
  if (co2Level < 800) return 'Test good';
  if (co2Level < 1000) return 'Test Moderate';
  if (co2Level < 1200) return 'Test Fair';
  if (co2Level < 1400) return 'Test Poor';
  return 'Dead';
}


const getMinutesSinceLastUpdated = (lastUpdated) => {
  const currentTime = new Date();
  const lastUpdatedTime = new Date(lastUpdated);
  const timeDifference = Math.abs(currentTime - lastUpdatedTime) / (1000 * 60); 
  return Math.floor(timeDifference);
};

const getCO2ColorClass = (co2Level) => {
  if (!co2Level) return 'text-gray-900';
  if (co2Level < 800) return 'text-green-600';
  if (co2Level < 1000) return 'text-yellow-600';
  return 'text-red-600';
};

const getLastUpdatedClass = (minutesSinceLastUpdated) => {
  if (minutesSinceLastUpdated < 10) return 'text-green-600';
  if (minutesSinceLastUpdated < 15) return 'text-yellow-600';
  return 'text-red-600';
};

export default OverviewTableBody;