import React, { useState, useEffect } from 'react';
import TableHeaders from '../TableHeaders';
import { useGetDeviceList } from '../../../../Hooks/Devices/useGetDeviceList';
import AdminTableBody from './AdminTableBody';
import { tableHeaders } from '../../../../utils/constants/constants';
import useSortableData from '../../../../Hooks/Tables/useSortableTable';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const AdminTable = () => {
  const { devices: initialData, apiError } = useGetDeviceList(
    `${apiKey}/api/v1/devices?amount=10000`
  );

  // Sort based on tableData, which will include updated data
  const [tableData, setTableData] = useState(initialData || []); // Initialize with fetched data
  const { sortedData, onSort, sortConfig } = useSortableData(tableData); // Sort based on tableData

  useEffect(() => {
    // Ensure the tableData is set correctly on initial load
    setTableData(initialData || []);
  }, [initialData]);

  const updateTableData = (updatedItem) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.dev_eui === updatedItem.dev_eui
          ? { ...item, ...updatedItem }
          : item
      )
    );
  };

  return (
    <>
      {apiError ? (
        <div className={'bg-red-500 text-white p-4'}>Error: {apiError}</div>
      ) : (
        <table
          className={
            'w-full text-sm text-left text-gray-500 divide-y divide-gray-200'
          }
        >
          <TableHeaders
            headers={tableHeaders}
            onSort={onSort}
            sortConfig={sortConfig}
          />
          <AdminTableBody
            tableFields={sortedData}
            updateTableData={updateTableData}
          />
        </table>
      )}
    </>
  );
};

export default AdminTable;
