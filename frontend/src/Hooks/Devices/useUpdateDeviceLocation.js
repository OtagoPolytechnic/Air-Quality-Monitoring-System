import { useState, useEffect } from 'react';

export const useAddLocationToDevice = (apiKey) => {
  const [device, setDevice] = useState({});
  const [apiError, setApiError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const resetApiError = () => {
    setApiError('');
  };

  const resetUpdateSuccess = () => {
    setUpdateSuccess('');
  };

  const updateDeviceLocationRequest = async (newLocation, deviceId) => {
    try {
      const newBlock = await fetch(`${apiKey}/addBlock/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blockName: newLocation.blockName })
      });

      const blockJson = await newBlock.json();

      if (blockJson.statusCode === 200) {
        return setUpdateSuccess(blockJson.message);
      }

      const newRoom = await fetch(`${apiKey}/devices/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_number: newLocation.room_number })
      });

      const roomJson = await newRoom.json();

      if (roomJson.statusCode === 200) {
        return setUpdateSuccess(roomJson.message);
      } else {
        if (roomJson.statusCode !== 200) {
          setApiError(roomJson.message);
        } else {
          setApiError(blockJson.message);
        }
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(apiKey);
      const data = await response.json();
      const mappedData = data.data.map((item) => {
        return {
          id: item.id,
          blockName: item.blockName,
          room_number: item.room_number
        };
      });
      setDevice(mappedData);
    } catch (error) {
      setApiError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    device,
    apiError,
    updateSuccess,
    resetApiError,
    resetUpdateSuccess,
    updateDeviceLocationRequest
  };
};
