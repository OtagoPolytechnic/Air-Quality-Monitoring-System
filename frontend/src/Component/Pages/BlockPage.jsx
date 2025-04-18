import { useState, useEffect } from "react"
import { useWebSocket } from '../../Context/WebSocketContext';
import { LoadingSpinner } from '../Spinner/LoadingSpinner';
import { NavLink, useParams } from 'react-router-dom';
import { Co2Sensor } from '../Co2/Co2Sensor';
import { checkOfflineDate } from '../../utils/dateTime/dateTimeFunctions';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

const BlockPage = () => {
    const { socket } = useWebSocket();
    const [isLoading, setIsLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(null); 
    const { blockName } = useParams();

    
useEffect(() => {
    const fetchDevices = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiKey}/api/v1/blocks/latest/${blockName}`);
        const data = await response.json();
        const extractedData = data.data.device.map(device => ({
          room_number: device.room_number,
          dev_eui: device.dev_eui,
          co2: device.sensorData.map(sensor => sensor.co2)[0],
          createdAt: device.sensorData.map(sensor => sensor.createdAt)[0],
          temperature: device.sensorData.map(sensor => sensor.temperature)[0]
        }));
        setDevices(extractedData);
      } catch (error) {
        setError(error.message); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, [socket]);



  return (
    <div className="text-center">
      <div data-cy="h1Welcome" className="lg:text-6xl md:text-4xl text-2xl text-gray-900">{blockName} CO<sub>2</sub> Monitor</div>
      <>
        {isLoading ? (
          <LoadingSpinner />
        ) : devices ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 px-4">
            {devices.map((device) => (
             <NavLink to={`/${blockName}/${device.room_number}`} key={device.dev_eui} data-cy={device.room_number}>
             <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-200 transition-all duration-300">
               <div className="flex items-center justify-between gap-6">
                 {/* Left: Room and CO2 Value */}
                 <div className="text-left">
                   <div className="text-base font-medium text-gray-800 mb-1">
                     Room {device.room_number}
                   </div>
                   <div className="text-3xl font-bold text-gray-900">
                     {checkOfflineDate(device.createdAt) ? 0 : device.co2}
                     <span className="text-base text-gray-500 font-normal ml-1">ppm</span>
                   </div>
                 </div>
           
                 {/* Right: Gauge - no hard size, let it breathe */}
                 <div className="flex items-center justify-center">
                   <div className="max-w-[140px] w-full">
                     <Co2Sensor
                       room_number={device.room_number}
                       co2={checkOfflineDate(device.createdAt) ? 0 : device.co2}
                     />
                   </div>
                 </div>
               </div>
             </div>
           </NavLink>
           
            
            ))}
          </div>
        ) : (
          <p>{error}</p>
        )}
      </>
    </div>
  );
};

export default BlockPage;