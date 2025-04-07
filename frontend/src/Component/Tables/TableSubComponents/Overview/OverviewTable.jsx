import React from 'react';
import TableHeaders from '../TableHeaders';
import OverviewTableBody from './OverviewTableBody';
import useSortableData from '../../../../Hooks/Tables/useSortableTable';
import { useGetRoomData } from '../../../../Hooks/Overview/useGetRoomData';
import { tableHeadersOverview } from "../../../../utils/constants/constants";

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const OverviewTable = () => {
  // Fetch room data
  const { rooms: initialData, apiError } = useGetRoomData(`${apiKey}/api/v1/devices`);
  const { sortedData, onSort, sortConfig } = useSortableData(initialData);
  console.log('Sorted Data:', sortedData);

  return (
    <>
      {apiError ? (
        <div className={'bg-red-500 text-white p-4'}>Error: {apiError}</div>
      ) : (
        <>
          {sortedData.length === 0 ? (
            <h1 className={'text-2xl text-center p-4'}>No rooms found</h1>
          ) : (
            <table className={'w-full text-medium text-left text-gray-500 divide-y divide-gray-200 '}>
              <TableHeaders headers={tableHeadersOverview} onSort={onSort} sortConfig={sortConfig} />
              <OverviewTableBody tableFields={sortedData} />
            </table>
          )}
        </>
      )}
    </>
  );
};

export default OverviewTable;