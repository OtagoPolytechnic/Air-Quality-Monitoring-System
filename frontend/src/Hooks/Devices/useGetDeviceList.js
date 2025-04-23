import {useState, useEffect} from 'react';


export const useGetDeviceList = (apiKey) => {
    const [devices, setDevices] = useState([
        {
            id: '',
            room_number: '',
            deviceName: '',
            dev_eui: '',
            lastSeen: '',
            blockName: '',
        },
    ]);
    const [apiError, setApiError] = useState("");
    
    const fetchData = async () => {
        let localError = "";
        try {
            const response = await fetch(apiKey);
            const data = await response.json();
            const mappedData = data.data.map((item) => {
                return {
                    id: item.id,
                    room_number: item.room_number ? item.room_number : "Unassigned",
                    deviceName: item.deviceId,
                    dev_eui: item.dev_eui,
                    lastSeen: item.updatedAt,
                    blockName: item.block ? item.block.blockName : "Unassigned",
                };
            });
            setDevices(mappedData);
        } catch (error) {
            localError = error.message;
        } finally {
            setApiError(localError);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { devices, apiError };
}
