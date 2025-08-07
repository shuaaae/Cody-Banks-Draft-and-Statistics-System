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

export default function ProgressionChart({ progressionData, loading, dateRange }) {
  // Generate date labels from the date range
  const generateDateLabels = () => {
    if (!dateRange || !dateRange[0]) return progressionData.map((d, i) => `Day ${i + 1}`);
    
    const startDate = new Date(dateRange[0].startDate);
    const endDate = new Date(dateRange[0].endDate);
    const labels = [];
    
    for (let i = 0; i < progressionData.length; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Format as "Aug 5", "Aug 6", etc.
      const month = currentDate.toLocaleDateString('en-US', { month: 'short' });
      const day = currentDate.getDate();
      labels.push(`${month} ${day}`);
    }
    
    return labels;
  };

  // Generate day count labels (Day 1, Day 2, etc.)
  const generateDayLabels = () => {
    return progressionData.map((d, i) => `Day ${i + 1}`);
  };

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
          labels: generateDayLabels(),
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
                title: ctx => {
                  // Show the actual date in the tooltip title
                  const dateLabels = generateDateLabels();
                  return dateLabels[ctx[0].dataIndex] || `Day ${ctx[0].dataIndex + 1}`;
                },
                label: ctx => {
                  const d = progressionData[ctx.dataIndex];
                  const total = d.win + d.lose;
                  const winRate = total > 0 ? ((d.win / total) * 100).toFixed(1) : 0;
                  return ` ${PROGRESSION_LABELS[d.score] || 'No Data'} (Win: ${d.win}, Lose: ${d.lose}, Win Rate: ${winRate}%)`;
                }
              }
            },
            title: {
              display: true,
              text: `TRAINING PROGRESS TRACKER - ${generateDateLabels().join(' to ')}`,
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