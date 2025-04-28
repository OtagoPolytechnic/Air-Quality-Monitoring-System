import AdminTable from './TableSubComponents/Admin/AdminTable';
import TableButton from './TableSubComponents/TableButton';
import { useGetBlockList } from '../../Hooks/Blocks/useGetBlockList';
import PopUp from './DevicePopUp';
import { useState } from 'react';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const AdminPanel = () => {
  const [modal, setModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const { blocks } = useGetBlockList(`${apiKey}/api/v1/blocks`);

  const handleClick = (type) => {
    setActionType(type);
    setModal(!modal);
  };

  const item = {}; // empty for new device

  return (
    <>
      {/* <TableButton text={'Add Device'} onClick={() => handleClick('add')} /> */}
      <div className="p-4">

      <section
        className={'relative overflow-x-auto mx-4 rounded-lg border shadow-sm'}
        > <AdminTable />
      </section>
        </div>
      {modal && (
        <PopUp
          handleClick={handleClick}
          item={item} // Pass the item (empty for new device)
          listOfBlocks={blocks} // Pass the list of blocks
          actionType={actionType} // Pass the action type
        />
      )}
    </>
  );
};

export default AdminPanel;
