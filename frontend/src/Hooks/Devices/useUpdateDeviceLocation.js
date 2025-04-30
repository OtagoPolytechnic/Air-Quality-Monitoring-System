import { useState, useEffect } from 'react';

export const useAddLocationToDevice = (apiKey) => {
  const [devices, setDevices] = useState({});
  const [apiError, setApiError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState("");

  const resetApiError = () => {
    setApiError('');
  };

  const resetUpdateSuccess = () => {
    setUpdateSuccess("");
  };

  const updateDeviceLocationRequest = async (newLocation, deviceEUI) => {
    try {
      const newBlock = await fetch(`${apiKey}/addBlock/${deviceEUI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blockName: newLocation.blockName })
      });

      const blockJson = await newBlock.json();

      const newRoom = await fetch(`${apiKey}/${deviceEUI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_number: newLocation.room_number })
      });

      const roomJson = await newRoom.json();

      if (roomJson.statusCode === 200 && blockJson.statusCode === 200) {
        setUpdateSuccess("Device location updated successfully");
      }
      else if (roomJson.statusCode !== 200) {
        setApiError(roomJson.message);
      } else {
        setApiError(blockJson.message);
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiKey);
        const data = await response.json();
        const mappedData = data.data.map((item) => {
          return {
            dev_eui: item.dev_eui,
            blockName: item.blockName,
            room_number: item.room_number
          };
        });
        setDevices(mappedData);
      } catch (error) {
        setApiError(error);
      }
    };

    fetchData();
  }, []);

  return {
    devices,
    apiError,
    updateSuccess,
    resetApiError,
    resetUpdateSuccess,
    updateDeviceLocationRequest
  };
};
