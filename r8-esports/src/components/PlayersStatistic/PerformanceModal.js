import React from 'react';
import { Bar } from 'react-chartjs-2';

const PerformanceModal = ({ 
  isOpen, 
  onClose, 
  modalInfo, 
  heroStats, 
  heroEvaluation, 
  playerEvaluation,
  onHeroEvaluationChange,
  onHeroEvaluationTextChange,
  onPlayerEvaluationChange,
  onQualityRating,
  onCommentChange
}) => {
  if (!isOpen || !modalInfo) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90" style={{ pointerEvents: 'auto' }}>
      <div className="bg-[#23232a] rounded-2xl shadow-2xl p-6 min-w-[1400px] max-w-[95vw] h-[800px] flex flex-col z-[10000]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">{modalInfo.player.name} - Performance Analysis</h2>
          <button 
            className="text-gray-400 hover:text-white text-2xl font-bold" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {/* Evaluation Forms Section - Now on top */}
          <div className="w-full flex gap-4">
            {/* Hero Evaluation */}
            <div className="flex-1 bg-gray-800 p-3 rounded-lg">
              <div className="text-yellow-300 font-bold mb-2 text-sm">HERO EVALUATION</div>
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <label className="text-white text-xs">Date:</label>
                  <input
                    type="text"
                    value={heroEvaluation.date}
                    onChange={(e) => onHeroEvaluationTextChange('date', e.target.value)}
                    className="w-full px-1 py-1 bg-gray-700 text-white rounded text-xs"
                    placeholder="Date"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white text-xs">Commitment:</label>
                  <input
                    type="text"
                    value={heroEvaluation.commitment}
                    onChange={(e) => onHeroEvaluationTextChange('commitment', e.target.value)}
                    className="w-full px-1 py-1 bg-gray-700 text-white rounded text-xs"
                    placeholder="Commitment"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white text-xs">Goal:</label>
                  <input
                    type="text"
                    value={heroEvaluation.goal}
                    onChange={(e) => onHeroEvaluationTextChange('goal', e.target.value)}
                    className="w-full px-1 py-1 bg-gray-700 text-white rounded text-xs"
                    placeholder="Goal"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div className="bg-black text-white text-center text-xs py-1 rounded">Black</div>
                <div className="bg-blue-600 text-white text-center text-xs py-1 rounded">Blue</div>
                <div className="bg-red-600 text-white text-center text-xs py-1 rounded">Red</div>
              </div>
              
              <div className="space-y-1 max-h-48 overflow-y-scroll scrollbar-hide">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-3 gap-1">
                    <input
                      type="text"
                      value={heroEvaluation.blackHeroes[index]}
                      onChange={(e) => onHeroEvaluationChange('blackHeroes', index, e.target.value)}
                      className="px-1 py-1 bg-black text-white rounded text-xs text-center"
                      placeholder="Hero"
                    />
                    <input
                      type="text"
                      value={heroEvaluation.blueHeroes[index]}
                      onChange={(e) => onHeroEvaluationChange('blueHeroes', index, e.target.value)}
                      className="px-1 py-1 bg-blue-600 text-white rounded text-xs text-center"
                      placeholder="Hero"
                    />
                    <input
                      type="text"
                      value={heroEvaluation.redHeroes[index]}
                      onChange={(e) => onHeroEvaluationChange('redHeroes', index, e.target.value)}
                      className="px-1 py-1 bg-red-600 text-white rounded text-xs text-center"
                      placeholder="Hero"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Player Evaluation */}
            <div className="flex-1 bg-gray-800 p-3 rounded-lg">
              <div className="text-yellow-300 font-bold mb-2 text-sm">PLAYER EVALUATION</div>
              <div className="flex gap-2 mb-2">
                <div className="w-1/4">
                  <label className="text-white text-xs">Date:</label>
                  <input
                    type="text"
                    value={playerEvaluation.date}
                    onChange={(e) => onPlayerEvaluationChange('date', e.target.value)}
                    className="w-full px-1 py-1 bg-green-600 text-white rounded text-xs"
                    placeholder="Date"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white text-xs">Notes:</label>
                  <textarea
                    value={playerEvaluation.notes || ''}
                    onChange={(e) => onPlayerEvaluationChange('notes', e.target.value)}
                    className="w-full px-1 py-1 bg-green-600 text-white rounded text-xs resize-none"
                    placeholder="Notes"
                    rows="2"
                    style={{ height: 'auto', minHeight: '32px' }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-1 mb-2">
                <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">Quality</div>
                <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">1-4</div>
                <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">5-6</div>
                <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">7-8</div>
                <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">9-10</div>
              </div>
              
              <div className="space-y-1 max-h-48 overflow-y-scroll scrollbar-hide">
                {Object.entries(playerEvaluation.qualities).slice(0, 10).map(([quality, rating], index) => (
                  <div key={quality} className="grid grid-cols-5 gap-1">
                    <div className="bg-green-200 text-black px-1 py-1 text-xs font-semibold truncate">{quality}</div>
                    <button
                      onClick={() => onQualityRating(quality, '1-4')}
                      className={`px-1 py-1 text-xs font-bold ${rating === '1-4' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                    >
                      {rating === '1-4' ? '✓' : ''}
                    </button>
                    <button
                      onClick={() => onQualityRating(quality, '5-6')}
                      className={`px-1 py-1 text-xs font-bold ${rating === '5-6' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                    >
                      {rating === '5-6' ? '✓' : ''}
                    </button>
                    <button
                      onClick={() => onQualityRating(quality, '7-8')}
                      className={`px-1 py-1 text-xs font-bold ${rating === '7-8' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                    >
                      {rating === '7-8' ? '✓' : ''}
                    </button>
                    <button
                      onClick={() => onQualityRating(quality, '9-10')}
                      className={`px-1 py-1 text-xs font-bold ${rating === '9-10' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                    >
                      {rating === '9-10' ? '✓' : ''}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Chart Section - Now below the tables */}
          <div className="w-full flex justify-start">
            <div className="w-1/2">
              <div className="text-yellow-300 font-bold mb-3 text-sm">PLAYER'S HERO PERFORMANCE CHART</div>
              {heroStats.length > 0 && (
                <div className="w-full bg-gray-800 rounded-lg p-3" style={{ height: '300px' }}>
                <Bar
                  data={{
                    labels: heroStats.map(row => row.hero),
                    datasets: [
                      {
                        label: 'SUCCESS RATE',
                        data: heroStats.map(row => row.winrate),
                        type: 'line',
                        borderColor: '#facc15',
                        backgroundColor: '#facc15',
                        yAxisID: 'y1',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#facc15',
                        order: 0,
                        z: 10,
                      },
                      {
                        label: 'WIN',
                        data: heroStats.map(row => Math.round(row.win)),
                        backgroundColor: '#3b82f6',
                        order: 1,
                      },
                      {
                        label: 'LOSE',
                        data: heroStats.map(row => Math.round(row.lose)),
                        backgroundColor: '#f87171',
                        order: 2,
                      },
                      {
                        label: 'TOTAL',
                        data: heroStats.map(row => Math.round(row.total)),
                        backgroundColor: '#22c55e',
                        order: 3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: { mode: 'index', intersect: false },
                    },
                    scales: {
                      y: { 
                        beginAtZero: true, 
                        title: { display: true, text: 'Count' },
                        ticks: {
                          stepSize: 1,
                          callback: function(value) {
                            return Math.round(value);
                          }
                        }
                      },
                      y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: { display: true, text: 'Success Rate (%)' },
                        min: 0,
                        max: 100,
                        grid: { drawOnChartArea: false },
                      },
                    },
                  }}
                />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModal; 