import { useState, useEffect } from "react"
import { useWebSocket } from '../../Context/WebSocketContext';
import { LoadingSpinner } from '../Spinner/LoadingSpinner';
import { NavLink } from 'react-router-dom';
import { Co2Sensor } from '../Co2/Co2Sensor';
import { useParams } from 'react-router-dom';
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
          <>
            <LoadingSpinner />
          </>
        ) : devices ? (
                  <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {devices.map((device) => (
                <NavLink to={`/${blockName}/${device.room_number}`} key={device.dev_eui} data-cy={device.room_number}>
                  <Co2Sensor  room_number={device.room_number} co2={checkOfflineDate(device.createdAt) ? 0 : device.co2} />
                </NavLink>
              ))}
              
            </div>
          </>
        ) : (
          <p>{(error)}</p>
        )}
      </>
    </div>
    )
}

export default BlockPage