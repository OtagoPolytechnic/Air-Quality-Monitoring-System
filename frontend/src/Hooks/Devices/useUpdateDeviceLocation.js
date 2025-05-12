import { useState, useEffect } from 'react';

export const useUpdateDeviceLocation = (apiKey, setError, setUpdateSuccess) => {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(false);

  const resetApiError = () => {
    setError('');
  };

  const resetUpdateSuccess = () => {
    setUpdateSuccess('');
  };

  const useUpdateDeviceBlockRequest = async (newBlock, deviceEUI) => {
    setLoading(true);
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
        setLoading(false);
        setUpdateSuccess('Device block updated successfully');
      } else {
        setError(blockData.message || 'Failed to update device block');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const useUpdateDeviceRoomRequest = async (newRoom, deviceEUI) => {
    setLoading(true);
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
        setLoading(false);
        setUpdateSuccess('Device room updated successfully');
      } else {
        setError(roomData.message || 'Failed to update device room');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    devices,
    loading,
    resetApiError,
    resetUpdateSuccess,
    useUpdateDeviceRoomRequest,
    useUpdateDeviceBlockRequest
  };
};
