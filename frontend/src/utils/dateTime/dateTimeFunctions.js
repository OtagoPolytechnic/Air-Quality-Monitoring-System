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
  if (!dateString) {
    return {
      topText: 'No data available',
      bottomText: ''
    };
  }
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  let topText;
  let bottomText;

  if (isToday) {
    topText = `Today, ${date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
    if (diffInMinutes < 60 && diffInMinutes != 1) {
      bottomText = `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes == 1) {
      bottomText = `${diffInMinutes} minute ago`;
    }
    else {
      bottomText = `${diffInHours} hours ago`;
    }
  } else if (isYesterday) {
    topText = `Yesterday, ${date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
    bottomText = `${diffInHours} hours ago`;
  } else {
    topText = `${date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })}, ${date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
    bottomText = `${diffInDays} days ago`;
  }

  return {
    topText,
    bottomText
  };
};
