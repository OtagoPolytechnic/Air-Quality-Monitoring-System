import { useState, useEffect } from 'react';

export const useUpdateDeviceLocation = (apiKey, setError, setUpdateSuccess) => {
  const [devices, setDevices] = useState({});

  const resetApiError = () => {
    setError('');
  };

  const resetUpdateSuccess = () => {
    setUpdateSuccess('');
  };

  const useUpdateDeviceBlockRequest = async (newBlock, deviceEUI) => {
    try {
      const response = await fetch(`${apiKey}/addBlock/${deviceEUI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blockName: newBlock.blockName })
      });

      const blockData = await response.json();

      if (blockData.statusCode === 200) {
        return setUpdateSuccess('Device block updated successfully');
      } else {
        setError(blockData.message || 'Failed to update device block');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const useUpdateDeviceRoomRequest = async (newRoom, deviceEUI) => {
    try {
      const response = await fetch(`${apiKey}/${deviceEUI}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_number: newRoom.room_number })
      });

      const roomData = await response.json();

      if (roomData.statusCode === 200) {
        return setUpdateSuccess('Device room updated successfully');
      } else {
        setError(roomData.message || 'Failed to update device room');
      }
    } catch (error) {
      setError(error.message);
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
        setError(error);
      }
    };

    fetchData();
  }, []);

  return {
    devices,
    resetApiError,
    resetUpdateSuccess,
    useUpdateDeviceRoomRequest,
    useUpdateDeviceBlockRequest
  };
};
