/**
 * Utility functions for CO2 data processing and display
 */
import { CO2_THRESHOLDS, sensorOfflineTimer } from '../constants/constants';

/**
 * Determines the learning condition based on CO2 levels
 * @param {number} co2Level - CO2 level in ppm
 * @returns {string} Description of learning conditions
 */
export const getCondition = (co2Level) => {
  if (!co2Level) return 'No data';
  if (co2Level < CO2_THRESHOLDS.EXCELLENT) return 'Great learning environment';
  if (co2Level < CO2_THRESHOLDS.GOOD) return 'Good learning environment';
  if (co2Level < CO2_THRESHOLDS.CONCERNING) return 'Drowsiness, reduced focus';
  if (co2Level < CO2_THRESHOLDS.POOR) return 'Drowsiness, headaches, poor concentration';
  return 'Unsafe, inability to learn effectively';
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
   * Determines text color class based on time since last update
   * @param {number} minutesSinceLastUpdated - Minutes since last update
   * @returns {string} Tailwind CSS class for text color
   */
  export const getLastUpdatedClass = (minutesSinceLastUpdated) => {
    if (minutesSinceLastUpdated < sensorOfflineTimer) return 'text-green-600';
    return 'text-red-600';
  };