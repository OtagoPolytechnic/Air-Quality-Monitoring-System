import React, { useState } from 'react';
import { UpdateButton } from '../Sensor/UpdateSensorSubComponents/UpdateButton';
import { useAddDeviceToBlock } from '../../Hooks/Devices/useAddDeviceToBlock';
import { UpdateFieldResponse } from '../Sensor/UpdateSensorSubComponents/UpdateFieldResponse';
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
  const [deviceName, setDeviceName] = useState(item.deviceId);
  const {
    addDeviceToBlockRequest,
    resetApiError,
    resetUpdateSuccess,
    updateSuccess,
    apiError
  } = useAddDeviceToBlock(`${apiKey}/api/v1/blocks`);
  const [formError, setFormError] = useState('');
  const disabled = actionType === 'edit';
  const modalTitle = actionType === 'add' ? 'Add Device' : 'Edit Device';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      resetApiError();
      resetUpdateSuccess();
      setFormError('');
      switch (actionType) {
        case 'add':
          if (!deviceName || !deviceEUI) {
            setFormError('Please fill in all required fields.');
            return;
          }

          
          
          handleClick();
          break;
        case 'edit':
          break;
        default:
          throw new Error('Invalid action type');
      }

      const updatedItem = {
        room_number: roomNumber,
        deviceId: deviceName,
        dev_eui: deviceEUI,
        blockName: blockName
      };

      // Make API call to update name (room_number) if changed
      if (item.room_number !== roomNumber) {
        await fetch(`${apiKey}/api/v1/devices/${item?.dev_eui}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedItem) // Send updated room_number
        });
      }

      // Make API call to update blockName if changed
      if (item.blockName !== blockName) {
        const response = await fetch(
          `${apiKey}/api/v1/devices/addBlock/${item?.dev_eui}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem) // Send updated blockName
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }

      // Update the table with the updated item (including room_number and blockName)
      updateTableData(updatedItem);

      // Close the modal
      handleClick();
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="max-w-lg rounded-xl overflow-hidden shadow-lg bg-white p-4">
        <div className="w-full p-4 text-gray-900">
          <div className="flex self-center items-center justify-center mb-8">
            <h1 className="text-3xl font-bold">{modalTitle}</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="w-full">
              <h1 className="text-xl font-bold">Device Information</h1>
              <label
                htmlFor="name"
                className="block text-sm font-semibold leading-8 mt-2"
              >
                Device Name {!disabled && <span className="text-red-500">*</span>}
              </label>
              <input
                required
                type="text"
                id="name"
                name="name"
                placeholder={item?.deviceId || 'Enter name'}
                value={deviceName} // Controlled input
                onChange={(e) => setDeviceName(e.target.value)} // Update state
                className="p-2 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="deviceEUI"
                className="block text-sm font-semibold leading-8 mt-2"
              >
                Device EUI {!disabled && <span className="text-red-500">*</span>}
              </label>
              <input
                disabled={disabled} // Disable for add action
                placeholder="FF:FF:FF:FF:FF:FF"
                type="text"
                id="deviceEUI"
                name="deviceEUI"
                value={deviceEUI}
                onChange={(e) => setDeviceEUI(e.target.value)}
                defaultValue={item?.dev_eui} // Display the device EUI
                className="p-2 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
              />
            </div>
            <h1 className="text-xl mt-8 font-bold">Location Information</h1>
            <div>
              <label
                htmlFor="room_number"
                className="block text-sm font-semibold leading-8 mt-2"
              >
                Room Number
              </label>
              <input
                required
                type="text"
                id="room_number"
                name="room_number"
                placeholder={item?.room_number || 'Unassigned'}
                defaultValue="Unassigned"
                value={roomNumber} // Controlled input
                onChange={(e) => setRoomNumber(e.target.value)} // Update state
                className="p-2 block w-full rounded-lg border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="blockName"
                className="block text-sm font-semibold leading-8 mt-2"
              >
                Block
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
            <div className="flex justify-end mb-2 mt-8">
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
            </div>
            <UpdateFieldResponse
              styles={`${formError || apiError ? 'text-red-500' : 'text-green-500'} mr-2 text-center`}
              text={updateSuccess || formError || apiError}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
