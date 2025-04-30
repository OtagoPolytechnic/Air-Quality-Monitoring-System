import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CustomXAxisTick } from '../../../src/utils/chartUtils';
import { SensorFilter } from './SensorFilter';
import { QuickFilter } from './QuickFilter';

// Main component for displaying sensor history
export const SensorHistory = ({ dev_eui }) => {
  const [error, setError] = useState('');
  const [sensorData, setSensorData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [filter, setFilter] = useState({ startDate: null, endDate: null, viewType: 'hourly' });

  const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

  // Dev fallback to auto-set a time range
  useEffect(() => {
    if (import.meta.env.DEV && !filter.startDate && !filter.endDate) {
      const endDate = new Date("2024-04-28T00:00:00Z");
      const startDate = new Date("2024-04-21T00:00:00Z");
      const newFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        viewType: "hourly"
      };
      setFilter(newFilter);
    }
  }, [filter]);

  // Fetch sensor data based on selected filter
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${apiKey}/api/v1/rooms/history/${dev_eui}?beforeDate=${filter.startDate}&afterDate=${filter.endDate}`
        );
        if (response.ok) {
          setError('');
          const data = await response.json();
          setSensorData(data);
        } else {
          if (response.status === 404) {
            setError(
              `There is no Co2 data between the dates: ${filter.startDate} and ${filter.endDate}.`
            );
          } else if (response.status === 500) {
            setError('Our servers are down.');
          } else {
            setError('An unexpected error occurred.');
          }
        }
      } catch {
        setError('Error fetching sensor data.');
      }
    };

    if (filter.startDate && filter.endDate) {
      fetchHistory();
    }
  }, [filter, apiKey]);

  // Sort sensor data whenever it changes
  useEffect(() => {
    if (sensorData && sensorData.data) {
      const sortedSensorData = sensorData.data
        .filter(d => d.createdAt)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setSortedData(sortedSensorData);
    }
  }, [sensorData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { co2, temperature, createdAt } = payload[0].payload;
      return (
        <div
          className="bg-gray-200 text-black text-xl p-1 border-solid border-2 border-black"
          data-testid="tooltip"
        >
          <p>Date: {new Date(createdAt).toLocaleString('en-NZ')}</p>
          <p>Temperature: {temperature}°C</p>
          <p>CO2 Level: {co2}</p>
        </div>
      );
    }
    return null;
  };

  const ErrorMessage = () => {
    if (error) {
      return (
        <div
          className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          data-testid="errormessage"
          role="alert"
        >
          <p className="text-lg">{error}</p>
        </div>
      );
    }
    return null;
  };

  const { viewType } = filter;

  return (
    <div className="p-8">
      <div
        className="recharts-wrapper mt-8 w-full max-w-4xl mx-auto text-gray-900"
        data-testid="SensorHistory"
        data-cy="SensorHistory"
      >
        <h1 className="text-2xl text-center font-bold mb-4" data-testid="SensorHistoryTitle">
          Sensor History
        </h1>
        <ResponsiveContainer data-testid="rechartsGraph" width="95%" height={400}>
          <LineChart
            data-testid="rechartsGraph"
            width={1000}
            height={500}
            data={sortedData}
          >
            <CartesianGrid strokeDasharray="10 5 3 5" />
            <XAxis
              dataKey="createdAt"
              tick={<CustomXAxisTick viewType={viewType} color="#000" />}
              tickLine={false}
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis yAxisId="left" type="number" domain={[0, 3000]} />
            <Tooltip data-testid="tooltip" content={<CustomTooltip />} />
            <Legend />
            <Line yAxisId="left" dataKey="co2" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <ErrorMessage data-cy="errormessage" />
        {/* Render the SensorFilter component and pass the filter state setter */}
        <QuickFilter onFilterChange={setFilter} />
        <SensorFilter onFilterChange={setFilter} />
      </div>
    </div>
  );
};
