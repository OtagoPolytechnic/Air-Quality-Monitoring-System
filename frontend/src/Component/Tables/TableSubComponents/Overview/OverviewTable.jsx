import React from 'react';
import TableHeaders from '../TableHeaders';
import OverviewTableBody from './OverviewTableBody';
import useSortableData from '../../../../Hooks/Tables/useSortableTable';
import { useGetRoomData } from '../../../../Hooks/Overview/useGetRoomData';
import { tableHeadersOverview } from "../../../../utils/constants/constants";

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const OverviewTable = ({ blockName }) => {

  // Determine which endpoint to use based on blockName passed when rendering OverviewPanel
  const endpoint = blockName 
    ? `${apiKey}/api/v1/blocks/latest/${blockName}`
    : `${apiKey}/api/v1/devices`; // Default endpoint if rendered incorrectly returns all devices
    
  const { rooms: initialData, apiError } = useGetRoomData(endpoint, blockName); // Fetch data from the API in Hooks/Overview/useGetRoomData 
  const { sortedData, onSort, sortConfig } = useSortableData(initialData); // Sort the data using the custom hook useSortableData

  return (
    <>
      {apiError ? (
        <div className={'bg-red-500 text-white p-4'}>Error: {apiError}</div>
      ) : (
        <>
          {sortedData.length === 0 ? (
            <h1 className={'text-2xl text-center p-4'}>No room sensors found</h1> // If no sensors are found within a block
          ) : (
            <table className={'w-full text-medium text-left text-gray-500 divide-y divide-gray-200 '}>
              <TableHeaders headers={tableHeadersOverview} onSort={onSort} sortConfig={sortConfig} />  {/* Render the table headers found in TableHeaders component */}
              <OverviewTableBody tableFields={sortedData} /> {/* Render the table body using the OverviewTableBody component */}
            </table>
          )}
        </>
      )}
    </>
  );
};

export default OverviewTable;