import { BarChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const dataset = [
  { month: 'Jan', london: 30, paris: 20, newYork: 10, seoul: 5 },
  { month: 'Feb', london: 25, paris: 15, newYork: 20, seoul: 10 },
  { month: 'Mar', london: 25, paris: 15, newYork: 20, seoul: 10 },
  // Add more data points as needed
];

const valueFormatter = (value: any) => `${value} mm`; // Example value formatter

const chartSetting = {
  width: 700,
  height: 400,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

export default function Bars() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { 
          dataKey: 'london', 
          label: 'London', 
          valueFormatter, 
          color: '#1E88E5' // Set the color for London
        },
        { 
          dataKey: 'paris', 
          label: 'Paris', 
          valueFormatter, 
          color: '#D32F2F' // Set the color for Paris
        },
        { 
          dataKey: 'newYork', 
          label: 'New York', 
          valueFormatter, 
          color: '#FFC107' // Set the color for New York
        },
        { 
          dataKey: 'seoul', 
          label: 'Seoul', 
          valueFormatter, 
          color: '#388E3C' // Set the color for Seoul
        },
      ]}
      {...chartSetting}
    />
  );
}
