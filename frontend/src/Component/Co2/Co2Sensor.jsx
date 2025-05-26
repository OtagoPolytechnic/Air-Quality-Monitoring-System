import GaugeComponent from 'react-gauge-component';

export const Co2Sensor = ({ co2 }) => {
  const value = parseInt(co2);

  const getColor = (val) => {
    if (val <= 1000) return '#22c55e';
    if (val <= 2000) return '#facc15';
    if (val <= 3500) return '#f97316';
    return '#ef4444';
  };

  return (
    <div >
      <GaugeComponent
        value={value}
        minValue={400}
        maxValue={7000}
        arc={{
          subArcs: [
            {
              limit: 7000,
              color: getColor(value),
            },
          ],
        }}
        labels={{
          valueLabel: {
            formatTextValue: () => `${value}`,
            style: {
            fontSize: '30px',
            fontWeight: 'bold',
            fill: '#1f2937',
            textShadow: 'none',  
            },
          },
          markLabel: {
            formatTextValue: (v) => `${v}`,
            style: {
              fontSize: '20px',
            },
          },
        }}
      />
    </div>
  );
};

