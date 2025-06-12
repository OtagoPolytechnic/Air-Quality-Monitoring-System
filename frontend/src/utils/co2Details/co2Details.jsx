import { GrStatusGood } from "react-icons/gr";
import { GiSnail, GiDeathSkull, GiBrokenSkull   } from "react-icons/gi";
import { ImSleepy } from "react-icons/im";
import { FaHeadSideVirus, FaHeartbeat } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";


export const getCo2Details = (ppm) => {
  if (ppm === 0) return [];

  if (ppm <= 1000) {
    return [
      { label: "Good", icon: <GrStatusGood className="text-green-600" /> },
    ];
  } else if (ppm <= 2000) {
    return [
      { label: "Reduced focus", icon: <GiSnail className="text-yellow-600" /> },
      { label: "Drowsiness", icon: <ImSleepy className="text-yellow-600" /> },
    ];
  } else if (ppm <= 5000) {
    return [
      { label: "Headaches", icon: <FaHeadSideVirus className="text-red-600" /> },
      { label: "Increased heart rate", icon: <FaHeartbeat className="text-red-600" /> },
    ];
  } else if (ppm <= 40000) {
    return [
      { label: "Unsafe", icon: <IoWarningOutline className="text-red-600" /> },
    ];
  } else {
    return [
      { label: "Permanent brain damage", icon: <GiBrokenSkull  className="text-red-800" /> },
      { label: "Death", icon: <GiDeathSkull className="text-red-800" /> },
    ];
  }
};

export function getCo2HoverBgColor(co2) {
  if (co2 === 0) return '';
  if (co2 < 1000) return 'hover:bg-green-100';
  if (co2 < 2000) return 'hover:bg-yellow-100';
  if (co2 < 5000) return 'hover:bg-red-100';
  return 'hover:bg-red-300';
}
