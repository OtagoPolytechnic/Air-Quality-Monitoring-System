import {useState, useEffect} from 'react';


export const useGetDeviceList = (apiKey) => {
    const [devices, setDevices] = useState([]);
    const [apiError, setApiError] = useState("");
    
    const fetchData = async () => {
        let localError = "";
        try {
            const response = await fetch(apiKey);
            const data = await response.json();
            const mappedData = data.data.map((item) => {
                return {
                    id: item.id,
                    room_number: item.room_number, //? item.room_number : "Unassigned",
                    deviceId: item.deviceId,
                    dev_eui: item.dev_eui,
                    lastSeen: item.sensorData[0]?.createdAt || "",
                    blockName: item.block?.blockName || "Unassigned",
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
