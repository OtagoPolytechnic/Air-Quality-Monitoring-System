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
    <div className="w-full max-w-[400px] aspect-square mx-auto">
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
          padding: 0,
          width: 0.3,
          backgroundColor: 'transparent',
        }}
        ticks={{
          number: 7,
          tickLabels: ['400', '1000', '2000', '3500', '5000', '6000', '7000']
        }}
        labels={{
          valueLabel: {
            formatTextValue: () => `${value}`,
            style: {
              fontSize: '34px',
              fill: '#1f2937', 
              letterSpacing: '1px'
            }
          },
          markLabel: {
            formatTextValue: (v) => `${v}`,
            style: {
              fontSize: '14px',
            }
          }
        }}
      />
    </div>
  );
};
