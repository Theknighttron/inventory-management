'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface BarChartProps {
  chartData: any;
  chartOptions: any;
}

const BarChart: React.FC<BarChartProps> = (props) => {
  const { chartData, chartOptions } = props;

  return (
    <Chart
      options={chartOptions}
      type="bar"
      width="100%"
      height="100%"
      series={chartData}
    />
  );
};

export default BarChart;
