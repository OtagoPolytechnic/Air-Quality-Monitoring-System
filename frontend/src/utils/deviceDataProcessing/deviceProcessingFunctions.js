/**
 * Utility functions for CO2 data processing and display
 */
import { CO2_THRESHOLDS, sensorOfflineTimer, TEMP_THRESHOLDS } from '../constants/constants';

/**
 * Determines the combined learning condition based on CO2 and temperature levels
 * @param {number} co2Level - CO2 level in ppm
 * @param {number} temperature - Temperature in °C (optional)
 * @returns {string} Description of learning conditions
 */
export const getCondition = (co2Level, temperature) => {
  // CO2 condition
  let co2Text = '';
  if (!co2Level) {
    co2Text = 'No CO2 data';
  } else if (co2Level < CO2_THRESHOLDS.EXCELLENT) {
    co2Text = 'Great learning environment';
  } else if (co2Level < CO2_THRESHOLDS.GOOD) {
    co2Text = 'Good learning environment';
  } else if (co2Level < CO2_THRESHOLDS.CONCERNING) {
    co2Text = 'Drowsiness, reduced focus';
  } else if (co2Level < CO2_THRESHOLDS.POOR) {
    co2Text = 'Drowsiness, headaches, poor concentration';
  } else {
    co2Text = 'Unsafe, inability to learn effectively';
  }
  
  // Temperature condition
  let tempText = '';
  if (!temperature) {
    tempText = 'No temperature data';
  } else if (temperature < TEMP_THRESHOLDS.COLD) {
    tempText = 'too cold, turn a heater';
  } else if (temperature < TEMP_THRESHOLDS.HOT) {
    tempText = 'good temperature';
  } else {
    tempText = 'too hot, open a window';
  }
  
  // Return combined condtion text
  return `${co2Text}, ${tempText}`;
};

  
  /**
   * Calculates minutes since last sensor update
   * @param {string} lastUpdated - ISO date string of last update
   * @returns {number} Minutes since last update
   */
  export const getMinutesSinceLastUpdated = (lastUpdated) => {
    const currentTime = new Date();
    const lastUpdatedTime = new Date(lastUpdated);
    const timeDifference = Math.abs(currentTime - lastUpdatedTime) / (1000 * 60); 
    return Math.floor(timeDifference);
  };
  
  /**
   * Determines text color class based on CO2 levels
   * @param {number} co2Level - CO2 level in ppm
   * @returns {string} Tailwind CSS class for text color
   */
  export const getCO2ColorClass = (co2Level) => {
    if (!co2Level) return 'text-gray-900';
    if (co2Level < CO2_THRESHOLDS.GOOD) return 'text-green-600';
    if (co2Level < CO2_THRESHOLDS.CONCERNING) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
 * Determines text color class based on temperature levels
 * @param {number} temperature - Temperature in °C
 * @returns {string} Tailwind CSS class for text color
 */
export const getTemperatureColorClass = (temperature) => {
  if (!temperature) return 'text-gray-900';
  if (temperature < TEMP_THRESHOLDS.COLD) return 'text-blue-600';
  if (temperature < TEMP_THRESHOLDS.HOT) return 'text-green-600';
  return 'text-red-600';
};
  
  /**
   * Determines text color class based on time since last update
   * @param {number} minutesSinceLastUpdated - Minutes since last update
   * @returns {string} Tailwind CSS class for text color
   */
  export const getLastUpdatedClass = (minutesSinceLastUpdated) => {
    if (minutesSinceLastUpdated < sensorOfflineTimer) return 'text-green-600';
    return 'text-red-600';
  };