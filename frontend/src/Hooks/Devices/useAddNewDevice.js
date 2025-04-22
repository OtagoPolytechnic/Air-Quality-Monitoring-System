import { useState, useEffect } from 'react';

export const useAddNewDevice = (apiKey) => {
  const [items, setItems] = useState({});
  const [apiError, setApiError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const resetApiError = () => {
    setApiError('');
  };

  const resetUpdateSuccess = () => {
    setUpdateSuccess('');
  };

  const addNewDeviceRequest = async (endpoint, devEui, blockName, deviceName) => {
    try {
      const addNewDevice = await fetch(`${endpoint}/addDevice/${devEui}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_number: roomNumber })
      });

      const confirmAdd = await addNewDevice.json();

      const { statusCode, message } = confirmAdd;

      if (statusCode === 200) {
        return setUpdateSuccess(message);
      } else {
        setApiError(message);
      }
    } catch (error) {
      setApiError(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(apiKey);
      const data = await response.json();
      const mappedData = data.data.map((item) => {
        return {
          id: item.id,
          dev_eui: item.dev_eui,
          room_number: item.room_number
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
    addNewDeviceRequest
  };
};
