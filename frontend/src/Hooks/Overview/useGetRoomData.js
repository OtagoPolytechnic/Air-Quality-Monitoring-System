import { useState, useEffect } from 'react';

export const useGetRoomData = (endpoint, blockName) => { // Endpoint and blockName are passed from the OverviewTable component
  const [rooms, setRooms] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }
        
        const data = await response.json();
        let processedData;

        if (blockName) {
          // Process data for block-specific endpoint
          // sensorData '?' to check if the sensorData array exists to catch undefined errors
          // sensorData || 0 or '' is a fallback value if the data is not available
          processedData = data.data.device.map(device => ({
            room_number: device.room_number,
            dev_eui: device.dev_eui,
            co2Level: device.sensorData[0]?.co2 || 0,
            temperature: device.sensorData[0]?.temperature || 0,
            lastUpdated: device.sensorData[0]?.createdAt || '',
            blockName: blockName
          }));
        } else {
          // Process data for all devices if no blockName is provided
          processedData = data.map(device => ({
            room_number: device.room_number,
            dev_eui: device.dev_eui,
            co2Level: device.co2 || 0,
            temperature: device.temperature || 0,
            lastUpdated: device.createdAt || '',
            blockName: device.blockName
          }));
        }
        
        setRooms(processedData);
      } catch (error) {
        console.error('Error fetching room data:', error);
        setApiError(error.message);
      }
    };

    fetchData();
  }, [endpoint, blockName]);

  return { rooms, apiError };
};

// Add default export
export default useGetRoomData;