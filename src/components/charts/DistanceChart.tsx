import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VelocityDataPoint {
  time: number;
  velocity1: number;
  velocity2: number;
  distance1: number;
  distance2: number;
}

interface DistanceChartProps {
  data: VelocityDataPoint[];
  config1Name: string;
  config2Name: string;
}

const DistanceChart: React.FC<DistanceChartProps> = ({ data, config1Name, config2Name }) => {
  const chartData = {
    labels: data.map(point => `${point.time}s`),
    datasets: [
      {
        label: `${config1Name} - Distance`,
        data: data.map(point => point.distance1),
        borderColor: 'rgb(34, 197, 94)', // Green
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.1,
        fill: false,
      },
      {
        label: `${config2Name} - Distance`,
        data: data.map(point => point.distance2),
        borderColor: 'rgb(239, 68, 68)', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Distance vs Time (Flat Ground)',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} m`;
          },
          afterBody: function(tooltipItems: any[]) {
            const index = tooltipItems[0].dataIndex;
            const point = data[index];
            return [
              `${config1Name} Velocity: ${point.velocity1.toFixed(1)} km/h`,
              `${config2Name} Velocity: ${point.velocity2.toFixed(1)} km/h`
            ];
          }
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (seconds)',
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 14,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Distance (meters)',
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 14,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value: any) {
            return `${value}m`;
          }
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
      },
      point: {
        hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DistanceChart;
