import React, { useState } from 'react';
import { UpdateButton } from '../../../Sensor/UpdateSensorSubComponents/UpdateButton';
import PopUp from '../../DevicePopUp';
import TableItem from '../TableItem';
import { useGetBlockList } from '../../../../Hooks/Blocks/useGetBlockList';
import {
  checkOfflineDate,
  formatDate
} from '../../../../utils//dateTime/dateTimeFunctions';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const AdminTableBody = ({ tableFields, updateTableData }) => {
  const { blocks } = useGetBlockList(`${apiKey}/api/v1/blocks`);
  const [modal, setModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item

  const handleClick = () => {
    setModal(!modal);
  };

  const handleEditClick = (type, item) => {
    setSelectedItem(item);
    setActionType(type);
    handleClick();
  };

  return (
    <>
      <tbody className="bg-white divide-y divide-gray-200">
        {tableFields.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-500">
              No devices found.
            </td>
          </tr>
        ) : (
          <>
            {tableFields.map((item) => {
              const { topText, bottomText } = formatDate(item.lastSeen);
              return (
                <tr key={item.id} className="hover:bg-gray-200 odd:bg-gray-50">
                  <td className="pl-2 py-2 text-gray-900">
                    <div className="font-semibold">{item.deviceId}</div>
                    <div className="text-gray-500 italic">{item.dev_eui}</div>
                  </td>
                  <TableItem item={item.room_number} />
                  <TableItem item={item.blockName} />
                  <td className="pl-2 py-2 text-gray-900">
                    <div className="font-semibold">{topText}</div>
                    <div className="text-gray-500 italic">{bottomText}</div>
                  </td>
                  <TableItem
                    item={
                      !item.lastSeen || checkOfflineDate(item.lastSeen)
                        ? 'Offline'
                        : 'Online'
                    }
                    className={
                      item.lastSeen
                        ? `${
                            checkOfflineDate(item.lastSeen)
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`
                        : 'text-red-500'
                    }
                  />
                  <td className="text-right pr-2 py-2 flex justify-end">
                    <UpdateButton
                      text="Edit"
                      style="py-2 px-4 text-white bg-blue-500 rounded-lg"
                      onClick={() => handleEditClick(() => 'edit', item)} // Pass the current item
                    />
                  </td>
                </tr>
              );
            })}
          </>
        )}
      </tbody>
      {modal &&
        selectedItem && ( // Ensure selectedItem is defined
          <PopUp
            handleClick={handleClick}
            item={selectedItem}
            listOfBlocks={blocks}
            updateTableData={updateTableData}
            actionType={actionType}
          />
        )}
    </>
  );
};

export default AdminTableBody;
