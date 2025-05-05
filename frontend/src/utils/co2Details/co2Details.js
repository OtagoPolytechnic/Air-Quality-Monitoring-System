export const getCo2Details = (ppm) => {
    if (ppm <= 400) {
      return {
        symptoms: "Normal – refreshed, awake.",
        airQuality: "Fresh outdoor air",
      };
    } else if (ppm <= 1000) {
      return {
        symptoms: "Normal.",
        airQuality: "Good indoor air quality",
      };
    } else if (ppm <= 2000) {
      return {
        symptoms: "Drowsiness, reduced focus, slow.",
        airQuality: "Heavy, uncomfortable (“stuffy”) air",
      };
    } else if (ppm <= 5000) {
      return {
        symptoms: "Headaches, drowsiness, loss of attention, increased heart rate.",
        airQuality: "Stagnant, stale, “stuffy” air",
      };
    } else if (ppm <= 40000) {
      return {
        symptoms: "Unsafe: potential asphyxiation over time, inability to perform work.",
        airQuality: "Enclosed non-ventilated spaces (i.e. silos); exceeds workplace exposure limits.",
      };
    } else {
      return {
        symptoms: "Permanent brain damage, coma, death.",
        airQuality: "Severe oxygen deprivation",
      };
    }
  };

  export function getCo2HoverBgColor(co2) {
    if (co2 < 1000) return 'hover:bg-green-100';
    if (co2 < 2000) return 'hover:bg-yellow-100';
    if (co2 < 5000) return 'hover:bg-red-100';
    return 'hover:bg-red-300';  // Optional: darker for extreme cases
  }