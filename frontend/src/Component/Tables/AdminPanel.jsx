import AdminTable from './TableSubComponents/Admin/AdminTable';
import { useGetBlockList } from '../../Hooks/Blocks/useGetBlockList';
import PopUp from './DevicePopUp';
import { useEffect, useState } from 'react';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const AdminPanel = () => {
  // const [modal, setModal] = useState(false);
  // const [actionType, setActionType] = useState('');
  // const { blocks, apiError } = useGetBlockList(`${apiKey}/api/v1/blocks`);

  // const handleClick = (type) => {
  //   setActionType(type);
  //   setModal(!modal);
  // };

  //const item = {};

  return (
    <>
      {/* {blocks.length == 0 ? (
        <p>no blocks - panel</p>
      ) : (
        <> */}
          <div className="p-4">
            <section
              className={
                'relative overflow-x-auto mx-4 rounded-lg border shadow-sm '
              }
            >
              {' '}
              <AdminTable />
            </section>
          </div>
          {/* {modal && (
            <PopUp
              handleClick={handleClick}
              item={item} // Pass the item (empty for new device)
              listOfBlocks={blocks} // Pass the list of blocks
              actionType={actionType} // Pass the action type
            />
          )} */}
        {/* </>
      )} */}
    </>
  );
};

export default AdminPanel;
