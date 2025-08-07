import React from 'react';
import expIcon from '../../assets/exp.png';
import jungleIcon from '../../assets/jungle.png';
import midIcon from '../../assets/mid.png';
import goldIcon from '../../assets/gold.png';
import roamIcon from '../../assets/roam.png';

// Lane icons mapping
const getLaneIcon = (lane) => {
  const laneLower = lane?.toLowerCase();
  switch (laneLower) {
    case 'exp':
      return expIcon;
    case 'jungler':
      return jungleIcon;
    case 'mid':
      return midIcon;
    case 'gold':
      return goldIcon;
    case 'roam':
      return roamIcon;
    default:
      return null;
  }
};

export default function DraftSlots({ type, team, heroes = [], size = 'w-12 h-12', isActiveSlot, handleHeroRemove, isCompleteDraft = false }) {
  // Define lane order for pick slots
  const laneOrder = ['exp', 'jungler', 'mid', 'gold', 'roam'];
  
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const hero = heroes[i];
        const isActive = isActiveSlot(type, team, i);
        const currentLane = laneOrder[i]; // Get lane for this slot position
        
        let outline = '';
        if (isActive && type === 'ban') outline = 'ring-4 ring-red-500';
        else if (isActive && type === 'pick' && team === 'blue') outline = 'ring-4 ring-blue-500';
        else if (isActive) outline = 'ring-4 ring-yellow-400';
        
        return (
          <div
            key={i}
            className={`m-1 flex items-center gap-1 ${type === 'pick' ? 'flex-row' : ''}`}
            style={{ pointerEvents: isCompleteDraft && hero ? 'auto' : 'none', cursor: isCompleteDraft && hero ? 'pointer' : 'default' }}
          >
            {/* Lane icon for Red Team picks - show first, always visible for pick slots */}
            {type === 'pick' && team === 'red' && getLaneIcon(currentLane) && (
              <div
                className="flex items-center justify-center"
                style={{ pointerEvents: 'none', cursor: 'default' }}
              >
                <img
                  src={getLaneIcon(currentLane)}
                  alt={`${currentLane} lane`}
                  className="w-12 h-12 object-contain"
                  draggable={false}
                />
              </div>
            )}
            
            {/* Hero icon */}
            <div
              className={`relative ${size} rounded-full bg-white/90 flex items-center justify-center overflow-hidden ${outline} ${isCompleteDraft && hero ? 'hover:scale-105 transition-transform duration-200' : ''}`}
              onDoubleClick={isCompleteDraft && hero ? () => handleHeroRemove(type, team, i) : undefined}
              title={isCompleteDraft && hero ? 'Double-click to remove' : ''}
            >
              {hero ? (
                <>
                  <img
                    src={`/heroes/${hero.role?.trim().toLowerCase()}/${hero.image}`}
                    alt={hero.name}
                    className="w-full h-full object-cover rounded-full"
                    draggable={false}
                  />
                  {/* X icon overlay for banned hero */}
                  {type === 'ban' && (
                    <span
                      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                      style={{
                        fontSize: 26,
                        color: 'rgba(220, 38, 38, 0.85)',
                        fontWeight: 'bold',
                        textShadow: '0 2px 8px #000',
                      }}
                    >
                      &#10006;
                    </span>
                  )}
                </>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-2xl" style={{ color: type === 'ban' ? '#ef4444' : '#3b82f6' }}>
                  {type === 'ban' ? '🚫' : '?'}
                </span>
              )}
            </div>
            
            {/* Lane icon for Blue Team picks - show after hero, always visible for pick slots */}
            {type === 'pick' && team === 'blue' && getLaneIcon(currentLane) && (
              <div
                className="flex items-center justify-center"
                style={{ pointerEvents: 'none', cursor: 'default' }}
              >
                <img
                  src={getLaneIcon(currentLane)}
                  alt={`${currentLane} lane`}
                  className="w-12 h-12 object-contain"
                  draggable={false}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
} 