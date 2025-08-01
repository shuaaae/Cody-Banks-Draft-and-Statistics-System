import React from 'react';
import defaultPlayer from '../../assets/default.png';
import expBg from '../../assets/expbg.jpg';
import midBg from '../../assets/midbg.jpg';
import roamBg from '../../assets/roambg.jpg';
import goldBg from '../../assets/goldbg.jpg';
import jungleBg from '../../assets/junglebg.jpg';

const PlayerCard = ({ lane, player, hero, highlight, onClick, getPlayerPhoto }) => {
  const playerPhoto = getPlayerPhoto ? getPlayerPhoto(player.name) : (player.photo ? player.photo : defaultPlayer);
  
  return (
    <button
      type="button"
      className="group relative flex items-center shadow-lg transition-all duration-300 overflow-hidden w-[520px] h-[150px] p-0 cursor-pointer focus:outline-none hover:shadow-2xl hover:scale-105 hover:border-l-4 hover:border-blue-500"
      style={{ 
        borderRadius: '12px 12px 12px 0px', 
        minWidth: 0, 
        border: 'none',
        background: (lane.key === 'exp' || lane.key === 'mid' || lane.key === 'roam' || lane.key === 'gold' || lane.key === 'jungler') ? 'transparent' : '#111216'
      }}
      onMouseEnter={(e) => {
        if (lane.key === 'exp') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="exp"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${expBg}) center/cover`;
          }
        } else if (lane.key === 'mid') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="mid"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${midBg}) center/cover`;
          }
        } else if (lane.key === 'roam') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="roam"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${roamBg}) center/cover`;
          }
        } else if (lane.key === 'gold') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="gold"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${goldBg}) center/cover`;
          }
        } else if (lane.key === 'jungler') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="jungler"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${jungleBg}) center/cover`;
          }
        } else {
          e.target.style.background = '#1a1d2a';
        }
      }}
      onMouseLeave={(e) => {
        if (lane.key === 'exp') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="exp"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${expBg}) center/cover`;
          }
        } else if (lane.key === 'mid') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="mid"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${midBg}) center/cover`;
          }
        } else if (lane.key === 'roam') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="roam"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${roamBg}) center/cover`;
          }
        } else if (lane.key === 'gold') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="gold"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${goldBg}) center/cover`;
          }
        } else if (lane.key === 'jungler') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="jungler"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${jungleBg}) center/cover`;
          }
        } else {
          e.target.style.background = '#111216';
        }
      }}
      onClick={onClick}
    >
      {/* Background image for exp, mid, roam, gold, and jungle lanes - positioned at the very back */}
      {lane.key === 'exp' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${expBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Exp lane background"
          data-lane="exp"
        />
      )}
      {lane.key === 'mid' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${midBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Mid lane background"
          data-lane="mid"
        />
      )}
      {lane.key === 'roam' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${roamBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Roam lane background"
          data-lane="roam"
        />
      )}
      {lane.key === 'gold' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${goldBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Gold lane background"
          data-lane="gold"
        />
      )}
      {lane.key === 'jungler' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${jungleBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Jungle lane background"
          data-lane="jungler"
        />
      )}
      <div className="relative flex-shrink-0 z-20" style={{ width: 140, height: 160, marginLeft: -30 }}>
        <img
          src={playerPhoto}
          alt="Player"
          className="absolute bottom-0 w-[140px] h-[160px] object-cover rounded-xl z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
          style={{ 
            objectPosition: 'center',
            left: '60%',
            transform: 'translateX(-50%)'
          }}
          onError={(e) => {
            console.error(`Failed to load image: ${playerPhoto}`);
            e.target.src = defaultPlayer;
          }}
          onLoad={() => {
            console.log(`Image loaded successfully: ${playerPhoto}`);
          }}
        />
      </div>
      <div className="flex-1 ml-8 min-w-0 flex flex-col justify-center z-30">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-white text-[1.35rem] font-bold tracking-wide truncate leading-tight">{player.name}</div>
          <div className="flex flex-col items-end ml-4 min-w-[90px] mr-8">
            <img 
              src={lane.icon} 
              alt={lane.label} 
              className="w-20 h-20 object-contain mb-1 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" 
            />
          </div>
        </div>
      </div>
    </button>
  );
};

export default PlayerCard; 