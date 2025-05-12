import React, { useState } from 'react';
import { UpdateButton } from '../Sensor/UpdateSensorSubComponents/UpdateButton';
import { useUpdateDeviceLocation } from '../../Hooks/Devices/useUpdateDeviceLocation';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

export const PopUp = ({
  handleClick,
  item,
  listOfBlocks,
  updateTableData,
  actionType
}) => {
  const [roomNumber, setRoomNumber] = useState(item.room_number);
  const [blockName, setBlockName] = useState(item.blockName);
  const [deviceEUI, setDeviceEUI] = useState(item.dev_eui);
  const [deviceId, setDeviceId] = useState(item.deviceId);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const {
    loading,
    useUpdateDeviceBlockRequest,
    useUpdateDeviceRoomRequest,
    resetApiError,
    resetUpdateSuccess
  } = useUpdateDeviceLocation(
    `${apiKey}/api/v1/devices`,
    setError,
    setUpdateSuccess
  );

  const disabled = actionType === 'edit';
  const modalTitle = actionType === 'add' ? 'Add Device' : 'Edit Device';

  console.log('Error:', error);
  console.log('Update Success:', updateSuccess);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === 'room_number') {
      setRoomNumber(value);
    } else if (name === 'blockName') {
      setBlockName(value);
    } else if (name === 'deviceEUI') {
      setDeviceEUI(value);
    } else if (name === 'deviceId') {
      setDeviceId(value);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      resetApiError();
      resetUpdateSuccess();
      setError('');

      const updatedItem = {
        room_number: roomNumber,
        blockName: blockName
      };

      if (blockName === 'Unassigned' && roomNumber !== 'Unassigned') {
        return setError('Must assign block or set room as "Unassigned"');
      }

      if (updatedItem.blockName !== item.blockName) {
        await useUpdateDeviceBlockRequest(updatedItem, deviceEUI);
      } else if (updatedItem.room_number !== item.room_number) {
        await useUpdateDeviceRoomRequest(updatedItem, deviceEUI);
      }

      if (!loading && !error) {
        updateTableData({ ...item, ...updatedItem });
        setTimeout(() => {
          handleClick();
        }, 1200);
      } else if (error && !loading) {
        console.error('Error updating device:', error);
      }
    } catch (err) {
      console.error('Error updating device:', err);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-1/3 h-1/2 rounded-xl overflow-hidden shadow-lg bg-white p-6">
        <div className="w-full h-full text-gray-900">
          <div className="flex self-center items-center justify-center mb-4">
            <h1 className="text-3xl font-bold">{modalTitle}</h1>
          </div>
          <form onSubmit={handleSubmit}>
            {!disabled && (
              <div>
                <h1 className="text-xl font-bold">Device Information</h1>
                <div>
                  <label className="block text-sm font-semibold leading-8 mt-2 px-2">
                    Device ID{' '}
                    {!disabled && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={item?.deviceId || 'Enter name'}
                    value={deviceId}
                    onChange={(e) => handleChange(e)}
                    className="p-2 pl-3 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deviceEUI"
                    className="block text-sm font-semibold leading-8 mt-2 px-2"
                  >
                    Device EUI{' '}
                    {!disabled && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    disabled={disabled}
                    placeholder="FF:FF:FF:FF:FF:FF"
                    type="text"
                    id="deviceEUI"
                    name="deviceEUI"
                    value={deviceEUI}
                    onChange={(e) => handleChange(e)}
                    className="p-2 pl-3 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>
            )}
            <div className="h-full flex flex-col justify-between gap-6">
              <div className="font-semibold text-base italic text-gray-600 text-center">
                <p>{item.deviceId}</p>
              </div>
              <h1 className="text-xl font-bold">Location Information</h1>
              <div>
                <label
                  htmlFor="blockName"
                  className="block text-sm font-semibold leading-8 mt-2 inline-flex justify-between w-full px-2"
                >
                  <p>Area</p>
                  <p className="text-gray-500 italic">
                    Must select area to assign room
                  </p>
                </label>
                <select
                  required
                  id="blockName"
                  name="blockName"
                  placeholder="Select Block"
                  value={blockName}
                  onChange={(e) => handleChange(e)}
                  className="p-2 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                >
                  <option value="Unassigned">Unassigned</option>
                  {listOfBlocks && listOfBlocks.length > 0 ? (
                    listOfBlocks
                      .sort((a, b) => a.blockName.localeCompare(b.blockName))
                      .map((block) => (
                        <option key={block.blockName} value={block.blockName}>
                          {block.blockName}
                        </option>
                      ))
                  ) : (
                    <option value="">No blocks available</option>
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="room_number"
                  className="block text-sm font-semibold leading-8 mt-4 inline-flex justify-between w-full px-2"
                >
                  <p>Room Number</p>
                  <p className="text-gray-500 italic">
                    "Unassigned" if not assigned
                  </p>
                </label>
                <input
                  required
                  type="text"
                  id="room_number"
                  name="room_number"
                  placeholder={roomNumber}
                  value={roomNumber}
                  onChange={(e) => handleChange(e)}
                  className="p-2 pl-3 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                />
                {error && (
                  <p className="text-center text-red-500 mt-2">{error}</p>
                )}
              </div>
              {!updateSuccess ? (
                <div className="flex flex-wrap flex-col gap-2 mt-2 w-full items-center justify-center flex-col">
                  <UpdateButton
                    style={
                      'bg-green-500 w-[145px] h-[40px] text-white text-base rounded-md hover:bg-green-600'
                    }
                    type={'submit'}
                    text={
                      loading
                        ? 'Loading...'
                        : actionType === 'edit'
                          ? 'Save Changes'
                          : 'Add Device'
                    }
                    disabled={loading || error}
                  />
                  <button
                    className="text-black underline mt-4 w-fit"
                    onClick={handleClick}
                    disabled={loading}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <p className="text-center text-green-500">{updateSuccess}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
