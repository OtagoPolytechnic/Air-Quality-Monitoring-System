import React, { useState } from 'react';
import { UpdateButton } from '../../../Sensor/UpdateSensorSubComponents/UpdateButton';
import PopUp from '../../DevicePopUp';
import TableItem from '../TableItem';
import { useGetBlockList } from '../../../../Hooks/Blocks/useGetBlockList';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const AdminTableBody = ({ tableFields, updateTableData }) => {
  const { blocks } = useGetBlockList(`${apiKey}/api/v1/blocks`);
  const [modal, setModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item
  // console.log(tableFields)
  const handleClick = () => {
    setModal(!modal);
  };

  const handleEditClick = (type, item) => {
    setSelectedItem(item);
    setActionType(type)
    handleClick();
  };

  return (
    <>
      <tbody className="bg-white divide-y divide-gray-200">
        {tableFields.map((item) => (
          <tr key={item.id} className="hover:bg-gray-100">
            <TableItem item={item.dev_eui} />
            <TableItem item={item.room_number} />
            <TableItem item={item.blockName} />
            <td className="text-right pr-2 py-2 flex justify-end">
              <UpdateButton
                text="Edit"
                style="py-2 px-4 text-white bg-blue-500 rounded-lg"
                onClick={() => handleEditClick(() => ('edit'),item)} // Pass the current item
              />
            </td>
          </tr>
        ))}
      </tbody>
      {modal && selectedItem && ( // Ensure selectedItem is defined
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