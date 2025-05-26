import GaugeComponent from 'react-gauge-component';

export const Co2Sensor = ({ co2 }) => {
  const value = parseInt(co2);

  const getColor = (val) => {
    if (val <= 1000) return { r: 34, g: 197, b: 94 };
    if (val <= 2000) return { r: 250, g: 204, b: 21 };
    if (val <= 3500) return { r: 249, g: 115, b: 22 };
    return { r: 239, g: 68, b: 68 };
  };

  const { r, g, b } = getColor(value);
  const solidColor = `rgb(${r}, ${g}, ${b})`;
  const fadedColor = `rgba(${r}, ${g}, ${b}, 0.2)`; 

  return (
    <div>
      <GaugeComponent
        value={value}
        minValue={400}
        maxValue={7000}
        arc={{
          subArcs: [
            {
              limit: 7000,
              color: solidColor,
              
            }
          ]
          ,emptyColor: fadedColor,
        }}
        labels={{
          valueLabel: {
            formatTextValue: () => `${value}`,
            style: {
              fontSize: '30px',
              fontWeight: 'bold',
              fill: '#1f2937',
              textShadow: 'none'
            }
          },
          markLabel: {
            formatTextValue: (v) => `${v}`,
            style: {
              fontSize: '20px'
            }
          }
        }}
      />
    </div>
  );
};
