import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PowerAnalysisData {
  config1Name: string;
  config2Name: string;
  config1Time: number; // seconds
  config2Time: number; // seconds
  config1FinalVelocity: number; // km/h
  config2FinalVelocity: number; // km/h
  timeDifference: number; // minutes
}

interface PowerAnalysisChartProps {
  data: PowerAnalysisData;
}

const PowerAnalysisChart: React.FC<PowerAnalysisChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Total Time (min)', 'Final Velocity (km/h)', 'Time Advantage (min)'],
    datasets: [
      {
        label: data.config1Name,
        data: [
          data.config1Time / 60, // Convert to minutes
          data.config1FinalVelocity,
          data.timeDifference > 0 ? Math.abs(data.timeDifference) : 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: data.config2Name,
        data: [
          data.config2Time / 60, // Convert to minutes
          data.config2FinalVelocity,
          data.timeDifference < 0 ? Math.abs(data.timeDifference) : 0
        ],
        backgroundColor: 'rgba(168, 85, 247, 0.8)', // Purple
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
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
        text: 'Performance Comparison',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const dataLabel = context.label;
            
            if (dataLabel === 'Total Time (min)') {
              return `${label}: ${value.toFixed(1)} minutes`;
            } else if (dataLabel === 'Final Velocity (km/h)') {
              return `${label}: ${value.toFixed(1)} km/h`;
            } else if (dataLabel === 'Time Advantage (min)') {
              return value > 0 ? `${label}: ${value.toFixed(1)} min faster` : `${label}: No advantage`;
            }
            return `${label}: ${value}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
  };

  return (
    <div className="h-80 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PowerAnalysisChart;
