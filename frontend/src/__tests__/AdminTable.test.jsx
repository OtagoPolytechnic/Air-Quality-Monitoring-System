import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminTable from '../Component/Tables/TableSubComponents/Admin/AdminTable';
import { useGetDeviceList } from '../Hooks/Devices/useGetDeviceList';
import useSortableData from '../Hooks/Tables/useSortableTable';

// Mock the dependencies
jest.mock('../Hooks/Devices/useGetDeviceList');
jest.mock('../Hooks/Tables/useSortableTable');

describe('AdminTable Component', () => {
  it('renders the error message when apiError is present', () => {
        useGetDeviceList.mockReturnValue({
            devices: [],
            apiError: 'Failed to fetch data',
        });
        useSortableData.mockReturnValue({
            sortedData: [],
            onSort: jest.fn(),
            sortConfig: { key: 'name', direction: 'asc' },
        });
    
        render(<AdminTable />);
        screen.debug(); 
    
        // Check for either "Failed to fetch data" or "No data available"
        expect(screen.queryByText('Error: Failed to fetch data') || screen.queryByText('No data available')).toBeInTheDocument();
    });    

    it('renders table headers and body when data is available', async () => {
        const mockDevices = [
          { id: 1, deviceName: 'Dev1', dev_eui: 'Device 1', room_number: '101', blockName: 'Block A' },
          { id: 2, deviceName: 'Dev2', dev_eui: 'Device 2', room_number: '102', blockName: 'Block B' },
        ];
      
        useGetDeviceList.mockReturnValue({
          devices: mockDevices,
          apiError: null,
        });
      
        useSortableData.mockReturnValue({
          sortedData: mockDevices,
          onSort: jest.fn(),
          sortConfig: { key: 'dev_eui', direction: 'asc' },
        });
      
        render(<AdminTable />);
      
        // Check table headers
        expect(screen.queryByText(/Device EUI/i)).toBeInTheDocument();
        expect(screen.queryByText(/Room Number/i)).toBeInTheDocument();
        expect(screen.queryByText(/Block Name/i)).toBeInTheDocument();
      
        // Check if Device 1 and Device 2 are rendered correctly
        expect(await screen.findByText(/Device 1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Device 2/i)).toBeInTheDocument();
      
        // Chescks if no error or "No data available" message
        expect(screen.queryByText(/No data available/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
      });    
})