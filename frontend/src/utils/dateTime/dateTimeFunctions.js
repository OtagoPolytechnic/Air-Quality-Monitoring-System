import { sensorOfflineTimer } from '../constants/constants';

// Check a devices last sensor update > 6 minutes
export const checkOfflineDate = (date) => {
  const currentDate = new Date();
  const lastUpdated = new Date(date);
  const diff = Math.abs(currentDate - lastUpdated) / 1000;
  const minutes = Math.floor(diff / 60);

  if (minutes >= sensorOfflineTimer) {
    return true;
  }
  return false;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    const diffInMs = now - date; // Difference in milliseconds
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hours ago`;
    }
  }

  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  };

  return date.toLocaleString('en-GB', options).replace(',', '');
};
