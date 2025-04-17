import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Co2Sensor } from "../Co2/Co2Sensor";
import { useWebSocket } from "../../Context/WebSocketContext";
import { SensorHistory } from "../History/SensorHistory";
import { LoadingSpinner } from "../Spinner/LoadingSpinner";
import { checkOfflineDate } from '../../utils/dateTime/dateTimeFunctions';

const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

export const RoomPage = () => {
  const { socket } = useWebSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const { roomNumber } = useParams();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setError(null);
        const response = await fetch(`${apiKey}/api/v1/devices/latest/${roomNumber}`);
        const data = await response.json();
        if (data.statusCode === 404) {
          setError(data.message);
        };
        const extractedData = {
          room_number: data.data.room_number,
          dev_eui: data.data.dev_eui,
          co2: data.data.sensorData.map(sensor => sensor.co2)[0],
          createdAt: data.data.sensorData.map(sensor => sensor.createdAt)[0],
          temperature: Math.round(data.data.sensorData.map(sensor => sensor.temperature)[0]),

        };
        setDevices(extractedData);
        console.log(extractedData)
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, [socket]);


  return (
    <div>
      <>
        {isLoading ? (
          <div className="pt-40">
            <LoadingSpinner />
          </div>
        ) : devices ? (
          <>
      {/* Maps the data that gives us the co2 level for the gauge */}
        <div key={devices.dev_eui}>
          <div className="flex justify-center items-center" data-testid="co2-sensor">
            <Co2Sensor room_number={devices.room_number} co2={checkOfflineDate(devices.createdAt) ? 0 : devices.co2} temp={devices.temperature} size="24rem" />

          </div>
          <SensorHistory dev_eui={devices.dev_eui}/>
        </div>
       </>
        ) : (
          <p>{(error)}</p>
        )}
      </>
    </div>
  );
};