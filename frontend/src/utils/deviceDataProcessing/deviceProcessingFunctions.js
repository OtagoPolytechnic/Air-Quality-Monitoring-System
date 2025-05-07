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
    co2Text = 'Great air quality';
  } else if (co2Level < CO2_THRESHOLDS.GOOD) {
    co2Text = 'Good air quality';
  } else if (co2Level < CO2_THRESHOLDS.CONCERNING) {
    co2Text = 'Stuffy';
  } else if (co2Level < CO2_THRESHOLDS.POOR) {
    co2Text = 'Poor air quality';
  } else {
    co2Text = 'Unsafe CO2 level';
  }
  
  // Temperature condition
  let tempText = '';
  if (!temperature) {
    tempText = 'No temperature data';
  } else if (temperature < TEMP_THRESHOLDS.COLD) {
    tempText = 'Cold';
  } else if (temperature < TEMP_THRESHOLDS.HOT) {
    tempText = 'Good temperature';
  } else {
    tempText = 'Hot';
  }
  
  // Return combined condtion text
  return `${co2Text}. ${tempText}`;
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

  /**
 * Determines badge styling based on CO2 and temperature status
 * @param {number} co2Level - CO2 level in ppm
 * @param {number} temperature - Temperature in °C
 * @returns {string} Tailwind CSS classes for badge styling
 */
export const getBadgeColorClass = (co2Level, temperature) => {
  const co2Class = getCO2ColorClass(co2Level);
  const tempClass = getTemperatureColorClass(temperature);
  
  // If either value is red, return red badge
  if (co2Class.includes('red') || tempClass.includes('red')) {
    return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500';
  }
  
  // If temp is cold, return blue badge
  if (tempClass.includes('blue')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500';
  }
  
  // If either value is yellow, return yellow badge
  if (co2Class.includes('yellow') || tempClass.includes('yellow')) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500';
  }
  
  // Otherwise return green badge
  return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500';
};