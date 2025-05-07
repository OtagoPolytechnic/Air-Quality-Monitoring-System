import { useState, useEffect } from 'react';

export const useGetRoomSensorsByBlock = (endpoint, blockName) => {
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
        const sourceArray = data.data?.device || data.data || [];
        
        const processedData = sourceArray.map(device => {
          // [0] is used to get the latest update
          const sensorData = device.sensorData?.[0] || device;
          
          return {
            // sensorData '?' to check if the sensorData array exists to catch undefined errors
            // sensorData || 0 or '' is a fallback value if the data is not available
            room_number: device.room_number,
            dev_eui: device.dev_eui,
            co2Level: sensorData?.co2 || 0,
            temperature: sensorData?.temperature || 0,
            lastUpdated: sensorData?.createdAt || device.createdAt || '',
            blockName: blockName || device.block?.blockName
          };
        });
        
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

export default useGetRoomSensorsByBlock;