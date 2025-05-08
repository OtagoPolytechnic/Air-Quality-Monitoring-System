import React from 'react';
import TableHeaders from '../TableHeaders';
import OverviewTableBody from './OverviewTableBody';
import useSortableData from '../../../../Hooks/Tables/useSortableTable';
import useGetRoomSensorsByBlock from '../../../../Hooks/Overview/useGetRoomSensorsByBlock';
import { tableHeadersOverview } from "../../../../utils/constants/constants";

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const OverviewTable = ({ blockName }) => {

  // Determine which endpoint to use based on blockName passed when rendering OverviewPanel
  const endpoint = `${apiKey}/api/v1/blocks/latest/${blockName}`;
    
  const { rooms: initialData, apiError } = useGetRoomSensorsByBlock(endpoint, blockName); // Fetch data from the API in Hooks/Overview/useGetRoomSensorsByBlock 
  const { sortedData, onSort, sortConfig } = useSortableData(initialData); // Sort the data using the custom hook useSortableData
  return (
    <>
      {apiError ? (
        <div className={'bg-red-500 text-white p-4'}>Error: {apiError}</div>
      ) : (
        <>
          {sortedData.length === 0 ? (
            <h1 className={'text-2xl text-center p-4'}>No room sensors found</h1>
          ) : (
            <table className={'w-full table-fixed text-medium text-left text-gray-500 divide-y divide-gray-200'}>
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