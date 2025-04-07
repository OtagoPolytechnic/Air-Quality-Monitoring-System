import { useState, useEffect } from 'react';

export const useGetRoomData = (url) => {
  const [rooms, setRooms] = useState([]);
  const [apiError, setApiError] = useState(null);
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API response structure:', result);
        
        const roomsData = Array.isArray(result) ? result : 
                         result.data && Array.isArray(result.data) ? result.data :
                         result.rooms && Array.isArray(result.rooms) ? result.rooms : [];
        
        // Step 2: Fetch sensor data for each room
        const roomsWithSensorData = await Promise.all(
          roomsData.map(async (room) => {
            try {
              // Use the same endpoint pattern as in Roompage.jsx
              const sensorResponse = await fetch(`${apiKey}/api/v1/devices/latest/${room.room_number}`);
              const sensorData = await sensorResponse.json();
              
              // Extract data using the same approach as Roompage.jsx
              return {
                ...room,
                blockName: room.block?.blockName || 'Unknown',
                co2Level: sensorData.data?.sensorData?.[0]?.co2 || 0,
                temperature: Math.round(sensorData.data?.sensorData?.[0]?.temperature) || 20,
                lastUpdated: new Date(sensorData.data?.sensorData?.[0]?.createdAt || room.createdAt || Date.now())
              };
            } catch (error) {
              console.error(`Error fetching sensor data for room ${room.room_number}:`, error);
              // Return room with default sensor values if fetch fails
              return {
                ...room,
                blockName: room.block?.blockName || 'Unknown',
                co2Level: 0,
                temperature: 20,
                lastUpdated: new Date(room.createdAt || Date.now())
              };
            }
          })
        );
        
        setRooms(roomsWithSensorData);
      } catch (error) {
        console.error('Error fetching room data:', error);
        setApiError(error.message);
      }
    };

    fetchRooms();
  }, [url]);

  return { rooms, apiError };
};