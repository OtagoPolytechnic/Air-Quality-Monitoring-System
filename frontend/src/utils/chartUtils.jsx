import { format, parseISO } from 'date-fns';

export const CustomXAxisTick = ({ x, y, payload, viewType, color = '#000' }) => {
  let displayDate = payload.value;

  if (viewType === 'hourly') {
    const time = new Date(displayDate);
    displayDate = format(time, 'haaa'); // e.g., 3PM
  } else {
    const date = parseISO(payload.value);
    const formattedDate = format(date, 'dd/MM');
    const formattedDay = format(date, 'EEE');
    displayDate = (
      <>
        <tspan x={0} dy="1em">{formattedDate}</tspan>
        <tspan x={0} dy="1em">{formattedDay}</tspan>
      </>
    );
  }
  console.log("Rendering tick:", payload.value, "as", viewType);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill={color} fontSize={10}>
        {displayDate}
      </text>
    </g>
  );
};
