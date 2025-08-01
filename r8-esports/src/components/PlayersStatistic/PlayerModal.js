import React from 'react';
import defaultPlayer from '../../assets/default.png';

const PlayerModal = ({ 
  modalInfo, 
  onClose, 
  getPlayerPhoto, 
  heroStats, 
  heroH2HStats, 
  isLoadingStats, 
  onFileSelect, 
  uploadingPlayer, 
  onViewPerformance 
}) => {
  if (!modalInfo) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#23232a] rounded-2xl shadow-2xl p-6 min-w-[600px] max-w-[90vw] relative flex flex-col animate-slideIn" 
        style={{ width: '700px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold" onClick={onClose}>&times;</button>
        
        {/* Player Profile Header */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={getPlayerPhoto(modalInfo.player.name, modalInfo.player.role)}
            alt="Player"
            className="w-16 h-16 object-cover mr-4 rounded-full cursor-pointer"
            onClick={() => onFileSelect && onFileSelect()}
            title="Click to upload new photo"
            style={{ opacity: uploadingPlayer === modalInfo.player.name ? 0.5 : 1, objectPosition: 'center' }}
          />
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-white text-xl font-bold">{modalInfo.player.name}</div>
              <img src={modalInfo.lane.icon} alt={modalInfo.lane.label} className="w-12 h-12 object-contain" />
            </div>
            {uploadingPlayer === modalInfo.player.name && <div className="text-blue-300 text-xs mt-1">Uploading...</div>}
          </div>
        </div>
        
        {/* Hero stats table */}
        <div className="w-full">
          <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO SUCCESS RATE (Scrim)</div>
          {isLoadingStats ? (
            <div className="text-center py-4">
              <div className="text-blue-300 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                <span className="text-sm">Loading stats...</span>
              </div>
            </div>
          ) : heroStats.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">Hero</th>
                  <th className="text-green-500 px-2 py-1">WIN</th>
                  <th className="text-red-500 px-2 py-1">LOSE</th>
                  <th className="px-2 py-1">TOTAL</th>
                  <th className="text-yellow-400 px-2 py-1">Success rate</th>
                </tr>
              </thead>
              <tbody>
                {heroStats.map((row, idx) => (
                  <tr key={row.hero + idx}>
                    <td className="px-2 py-1 text-white font-semibold">{row.hero}</td>
                    <td className="px-2 py-1 text-green-400 text-center">{row.win}</td>
                    <td className="px-2 py-1 text-red-400 text-center">{row.lose}</td>
                    <td className="px-2 py-1 text-center">{row.total}</td>
                    <td className="px-2 py-1 text-yellow-300 text-center">{row.winrate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-400">No hero stats available.</div>
          )}
        </div>
        
        {/* H2H stats table */}
        <div className="mt-8 w-full">
          <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO SUCCESS RATE vs ENEMY (H2H)</div>
          {isLoadingStats ? (
            <div className="text-center py-4">
              <div className="text-blue-300 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                <span className="text-sm">Loading stats...</span>
              </div>
            </div>
          ) : heroH2HStats.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">Hero Used</th>
                  <th className="text-left px-2 py-1">Enemy</th>
                  <th className="text-green-500 px-2 py-1">WIN</th>
                  <th className="text-red-500 px-2 py-1">LOSE</th>
                  <th className="px-2 py-1">TOTAL</th>
                  <th className="text-yellow-400 px-2 py-1">Success rate</th>
                </tr>
              </thead>
              <tbody>
                {heroH2HStats.map((row, idx) => (
                  <tr key={row.player_hero + row.enemy_hero + idx}>
                    <td className="px-2 py-1 text-white font-semibold">{row.player_hero}</td>
                    <td className="px-2 py-1 text-blue-300 font-semibold">{row.enemy_hero}</td>
                    <td className="px-2 py-1 text-green-400 text-center">{row.win}</td>
                    <td className="px-2 py-1 text-red-400 text-center">{row.lose}</td>
                    <td className="px-2 py-1 text-center">{row.total}</td>
                    <td className="px-2 py-1 text-yellow-300 text-center">{row.winrate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-400">No H2H stats available.</div>
          )}
        </div>
        
        <div className="text-gray-300 text-left mt-2">
          {heroStats.length === 0 && (
            'More player/lane/hero details can go here.'
          )}
        </div>
        
        {/* View Performance Button */}
        <div className="mt-6 w-full flex justify-center">
          <button
            onClick={onViewPerformance}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors duration-200 shadow-lg"
          >
            View Performance
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal; 