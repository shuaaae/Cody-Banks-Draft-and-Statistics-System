import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

const PROGRESSION_LABELS = {
  5: 'EXCELLENT',
  4: 'GOOD',
  3: 'MEDIOCRE',
  2: 'BAD',
  1: 'VERY POOR PERF.'
};

export default function ProgressionChart({ progressionData, loading }) {
  if (loading) {
    return <div className="text-blue-300 mt-8">Loading...</div>;
  }

  if (progressionData.length === 0) {
    return <div className="text-gray-300 mt-8">No data for selected range.</div>;
  }

  return (
    <div className="w-full">
      <Line
        data={{
          labels: progressionData.map((d, i) => `Day ${i + 1}`),
          datasets: [
            {
              label: 'Progression',
              data: progressionData.map(d => d.score),
              borderColor: '#facc15',
              backgroundColor: '#facc15',
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: '#facc15',
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const d = progressionData[ctx.dataIndex];
                  return ` ${PROGRESSION_LABELS[d.score] || 'No Data'} (Win: ${d.win}, Lose: ${d.lose})`;
                }
              }
            },
            title: {
              display: true,
              text: 'TRAINING PROGRESS TRACKER',
              font: { size: 22, weight: 'bold' },
              color: '#fff',
              padding: { top: 10, bottom: 20 }
            }
          },
          scales: {
            y: {
              min: 1,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: v => `${v} ${PROGRESSION_LABELS[v] ? PROGRESSION_LABELS[v] : ''}`,
                color: '#fff',
                font: { weight: 'bold' }
              },
              title: {
                display: true,
                text: 'PROGRESSION',
                color: '#fff',
                font: { weight: 'bold' }
              },
              grid: { color: '#444' }
            },
            x: {
              title: {
                display: true,
                text: 'NUMBER OF DAYS',
                color: '#fff',
                font: { weight: 'bold' }
              },
              ticks: { color: '#fff', font: { weight: 'bold' } },
              grid: { color: '#444' }
            }
          }
        }}
        height={350}
        width={900}
      />
    </div>
  );
} 