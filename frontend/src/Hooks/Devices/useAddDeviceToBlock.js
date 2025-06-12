import { useState, useEffect } from 'react';

export const useAddDeviceToBlock = (apiKey) => {
  const [items, setItems] = useState({});
  const [apiError, setApiError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const resetApiError = () => {
    setApiError('');
  };

  const resetUpdateSuccess = () => {
    setUpdateSuccess('');
  };

  const addDeviceToBlockRequest = async (endpoint, blockName, deviceName) => {
    try {
      const addDevice = await fetch(`${endpoint}/addBlock/${deviceName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blockName: blockName })
      });

      const confirmAdd = await addDevice.json();

      const { statusCode, message } = confirmAdd;

      if (statusCode === 200) {
        return setUpdateSuccess(message);
      } else {
        setApiError(message);
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
          blockName: item.blockName
        };
      });
      setItems(mappedData);
    } catch (error) {
      setApiError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    items,
    apiError,
    updateSuccess,
    resetApiError,
    resetUpdateSuccess,
    addDeviceToBlockRequest
  };
};
