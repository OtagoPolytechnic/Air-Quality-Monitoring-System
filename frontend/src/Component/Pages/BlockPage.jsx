import { useState, useEffect } from "react"
import { useWebSocket } from '../../Context/WebSocketContext';
import { LoadingSpinner } from '../Spinner/LoadingSpinner';
import { NavLink, useParams } from 'react-router-dom';
import { Co2Sensor } from '../Co2/Co2Sensor';
import { checkOfflineDate } from '../../utils/dateTime/dateTimeFunctions';
import { getCo2Details, getCo2HoverBgColor } from '../../utils/co2Details/co2Details'

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-4">
            {devices.map((device) => (
               <NavLink to={`/${blockName}/${device.room_number}`} key={device.dev_eui} data-cy={device.room_number}>
               <div className={`bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-200 transition-all duration-300 ${getCo2HoverBgColor(checkOfflineDate(device.createdAt) ? 0 : device.co2)}`}>
                 <div className="flex flex-col justify-between h-full">
                   <div className="flex items-center justify-between gap-4">
                     <div className="text-left mr-2 flex-1">
                       <div className="text-5xl text-gray-800 mb-2">
                         Room {device.room_number}
                       </div>
                       <div className="text-5xl font-bold text-gray-900 mb-2">
                         {checkOfflineDate(device.createdAt) ? 0 : device.co2}
                         <span className="text-2xl text-gray-500 font-normal ml-1">ppm</span>
                       </div>
                     </div>
                     <div className="flex items-center justify-center ml-2">
                       <div className="max-w-[200px] w-full">
                         <Co2Sensor
                           room_number={device.room_number}
                           co2={checkOfflineDate(device.createdAt) ? 0 : device.co2}
                         />
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-2 mt-4">
                   {getCo2Details(checkOfflineDate(device.createdAt) ? 0 : device.co2).map((detail, index) => (
                       <div
                         key={index}
                         className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-base font-medium text-gray-700 shadow-sm"
                         >
                         {detail.icon}
                         <span>{detail.label}</span>
                       </div>
                     ))}
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