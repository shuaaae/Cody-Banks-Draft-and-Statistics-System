import React from 'react';

export default function DraftSlots({ type, team, heroes = [], size = 'w-12 h-12', isActiveSlot }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const hero = heroes[i];
        const isActive = isActiveSlot(type, team, i);
        let outline = '';
        if (isActive && type === 'ban') outline = 'ring-4 ring-red-500';
        else if (isActive && type === 'pick' && team === 'blue') outline = 'ring-4 ring-blue-500';
        else if (isActive) outline = 'ring-4 ring-yellow-400';
        
        return (
          <div
            key={i}
            className={`m-1 relative ${size} rounded-full bg-white/90 flex items-center justify-center overflow-hidden ${outline}`}
            style={{ pointerEvents: 'none', cursor: 'default' }}
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
        );
      })}
    </>
  );
} 