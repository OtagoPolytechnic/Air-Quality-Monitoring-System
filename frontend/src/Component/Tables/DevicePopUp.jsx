import React, { useState } from 'react';
import { UpdateButton } from '../Sensor/UpdateSensorSubComponents/UpdateButton';
import { useAddDeviceToBlock } from '../../Hooks/Devices/useAddDeviceToBlock';
import { UpdateFieldResponse } from '../Sensor/UpdateSensorSubComponents/UpdateFieldResponse';
import { useAddLocationToDevice } from '../../Hooks/Devices/useUpdateDeviceLocation';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

export const PopUp = ({
  handleClick,
  item,
  listOfBlocks,
  updateTableData,
  actionType
}) => {
  // Set default state values based on `item`
  const [roomNumber, setRoomNumber] = useState(item.room_number);
  const [blockName, setBlockName] = useState(item.blockName);
  const [deviceEUI, setDeviceEUI] = useState(item.dev_eui);
  const [deviceId, setDeviceId] = useState(item.deviceId);
  const {
    updateDeviceLocationRequest,
    resetApiError,
    resetUpdateSuccess,
    updateSuccess,
    apiError
  } = useAddLocationToDevice(`${apiKey}/api/v1/devices`);
  const [formError, setFormError] = useState('');
  const disabled = actionType === 'edit';
  const modalTitle = actionType === 'add' ? 'Add Device' : 'Edit Device';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      resetApiError();
      resetUpdateSuccess();
      setFormError('');

      const updatedItem = {
        room_number: roomNumber,
        blockName: blockName
      };

      if (blockName === 'Unassigned' && roomNumber !== 'Unassigned') {
        setFormError("Must assign block or set room as 'Unassigned'");
        return;
      }

      if (item.room_number !== roomNumber || item.blockName !== blockName) {
        await updateDeviceLocationRequest(updatedItem, deviceEUI);
        if (apiError) {
          throw new Error('Network response was not ok');
        }
        if (updateSuccess) updateTableData(updatedItem);
        else {
          setFormError('Error updating device');
        }
      }

    } catch (error) {
      console.error('Error updating device:', error);
      alert('Error updating device:', error.message);
    } finally {
      setTimeout(() => {
        handleClick();
        resetUpdateSuccess();
        resetApiError();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="max-w-lg rounded-xl overflow-hidden shadow-lg bg-white p-4">
        <div className="w-full p-4 text-gray-900">
          <div className="flex self-center items-center justify-center mb-4">
            <h1 className="text-3xl font-bold">{modalTitle}</h1>
          </div>
          <form onSubmit={handleSubmit}>
            {!disabled && (
              <div>
                <h1 className="text-xl font-bold">Device Information</h1>
                <div>
                  <label
                    // htmlFor="deviceId"
                    className="block text-sm font-semibold leading-8 mt-2 px-2"
                  >
                    Device ID{' '}
                    {!disabled && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    required
                    type="text"
                    // id="deviceId"
                    // name="deviceId"
                    placeholder={item?.deviceId || 'Enter name'}
                    value={deviceId} 
                    onChange={(e) => setDeviceId(e.target.value)} 
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
                    disabled={disabled} // Disable for add action
                    placeholder="FF:FF:FF:FF:FF:FF"
                    type="text"
                    id="deviceEUI"
                    name="deviceEUI"
                    value={deviceEUI}
                    onChange={(e) => setDeviceEUI(e.target.value)}
                    // defaultValue={item?.dev_eui} // Display the device EUI
                    className="p-2 pl-3 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>
            )}
            <div>
              <div className="font-semibold text-base italic text-gray-600 text-center">
                <p>{item.deviceId}</p>
              </div>
              <h1 className="text-xl mt-4 font-bold">Location Information</h1>
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
                  value={blockName} // Controlled input
                  onChange={(e) => setBlockName(e.target.value)} // Update state
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
              {blockName === 'Unassigned' && roomNumber !== 'Unassigned' && (
                <div className="rounded-lg p-1.5 text-red-600 italic">
                  <p className="text-sm font-semibold">Must assign block or set room as "Unassigned"</p>
                </div>
              )}
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
                  placeholder={roomNumber ?? 'Unassigned'}
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="p-2 pl-3 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="flex justify-end mb-2 mt-8"></div>
              <UpdateButton
                style={
                  'bg-blue-500 w-[150px] h-[45px] text-white rounded-md ml-6'
                }
                type={'submit'}
                text={actionType === 'edit' ? 'Save Changes' : 'Add Device'}
              />
              <UpdateButton
                style={
                  'bg-red-500 w-[150px] h-[45px] text-white rounded-md mx-6'
                }
                type="button" // Make sure this button is just a "button", not "submit"
                onClick={handleClick} // Close button
                text="Cancel"
              />
            <p
              styles={`${formError || apiError ? 'text-red-500' : 'text-green-500'} mr-2 text-center`}
              text={updateSuccess || formError || apiError}
            />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
