import React from 'react';
import PlayerCard from './PlayerCard';
import defaultPlayer from '../../assets/default.png';

const PlayerGrid = ({ 
  teamPlayers, 
  players, 
  lanePlayers, 
  LANES, 
  PLAYER, 
  getPlayerNameForLane, 
  getRoleByLaneKey, 
  getHeroForLaneByLaneKey, 
  getPlayerIdentifier, 
  getPlayerPhoto, 
  onPlayerClick 
}) => {
  // Check if we have 6 players
  const playersArray = teamPlayers?.players_data || teamPlayers?.players;
  const hasSixPlayers = playersArray && playersArray.length === 6;

  if (hasSixPlayers) {
    // 3x3 grid layout for 6 players
    return (
      <div className="w-full flex flex-col items-center mt-12 space-y-4">
        {/* Top row - 3 players (exp, mid, jungler) */}
        <div className="flex flex-row justify-center gap-x-8 w-full">
          {(() => {
            const playerName = getPlayerNameForLane('exp', 0);
            const playerRole = getRoleByLaneKey('exp');
            const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
            const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
            return (
              <PlayerCard 
                lane={LANES[0]} 
                player={playerObj} 
                hero={getHeroForLaneByLaneKey('exp', lanePlayers)} 
                onClick={() => onPlayerClick({ 
                  lane: LANES[0], 
                  player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                  hero: getHeroForLaneByLaneKey('exp', lanePlayers) 
                })} 
                getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
              />
            );
          })()}
          {(() => {
            const playerName = getPlayerNameForLane('mid', 1);
            const playerRole = getRoleByLaneKey('mid');
            const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
            const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
            return (
              <PlayerCard 
                lane={LANES[1]} 
                player={playerObj} 
                hero={getHeroForLaneByLaneKey('mid', lanePlayers)} 
                onClick={() => onPlayerClick({ 
                  lane: LANES[1], 
                  player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                  hero: getHeroForLaneByLaneKey('mid', lanePlayers) 
                })} 
                getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
              />
            );
          })()}
          {(() => {
            const playerName = getPlayerNameForLane('jungler', 2);
            const playerRole = getRoleByLaneKey('jungler');
            const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
            const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
            return (
              <PlayerCard 
                lane={LANES[2]} 
                player={playerObj} 
                hero={getHeroForLaneByLaneKey('jungler', lanePlayers)} 
                onClick={() => onPlayerClick({ 
                  lane: LANES[2], 
                  player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                  hero: getHeroForLaneByLaneKey('jungler', lanePlayers) 
                })} 
                getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
              />
            );
          })()}
        </div>
        {/* Bottom row - 3 players (gold, roam, substitute) */}
        <div className="flex flex-row justify-center gap-x-8 w-full">
          {(() => {
            const playerName = getPlayerNameForLane('gold', 3);
            const playerRole = getRoleByLaneKey('gold');
            const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
            const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
            return (
              <PlayerCard 
                lane={LANES[3]} 
                player={playerObj} 
                hero={getHeroForLaneByLaneKey('gold', lanePlayers)} 
                onClick={() => onPlayerClick({ 
                  lane: LANES[3], 
                  player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                  hero: getHeroForLaneByLaneKey('gold', lanePlayers) 
                })} 
                getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
              />
            );
          })()}
          {(() => {
            const playerName = getPlayerNameForLane('roam', 4);
            const playerRole = getRoleByLaneKey('roam');
            const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
            const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
            return (
              <PlayerCard 
                lane={LANES[4]} 
                player={playerObj} 
                hero={getHeroForLaneByLaneKey('roam', lanePlayers)} 
                onClick={() => onPlayerClick({ 
                  lane: LANES[4], 
                  player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                  hero: getHeroForLaneByLaneKey('roam', lanePlayers) 
                })} 
                getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
              />
            );
          })()}
          {(() => {
            // 6th player - use the 6th player from the team data
            const playerName = getPlayerNameForLane('sub', 5);
            const playerRole = getRoleByLaneKey('sub');
            const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
            const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
            return (
              <PlayerCard 
                lane={{ key: 'sub', label: 'SUBSTITUTE', icon: defaultPlayer }} 
                player={playerObj} 
                hero={getHeroForLaneByLaneKey('sub', lanePlayers)} 
                onClick={() => onPlayerClick({ 
                  lane: { key: 'sub', label: 'SUBSTITUTE', icon: defaultPlayer }, 
                  player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                  hero: getHeroForLaneByLaneKey('sub', lanePlayers) 
                })} 
                getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
              />
            );
          })()}
        </div>
      </div>
    );
  }

  // Original 5-player layout
  return (
    <div className="w-full flex flex-col items-center mt-12 space-y-4">
      <div className="flex flex-row justify-center gap-x-8 w-full">
        {(() => {
          const playerName = getPlayerNameForLane('exp', 0);
          const playerRole = getRoleByLaneKey('exp');
          const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
          const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
          return (
            <PlayerCard 
              lane={LANES[0]} 
              player={playerObj} 
              hero={getHeroForLaneByLaneKey('exp', lanePlayers)} 
              onClick={() => onPlayerClick({ 
                lane: LANES[0], 
                player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                hero: getHeroForLaneByLaneKey('exp', lanePlayers) 
              })} 
              getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
            />
          );
        })()}
        {(() => {
          const playerName = getPlayerNameForLane('mid', 1);
          const playerRole = getRoleByLaneKey('mid');
          const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
          const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
          return (
            <PlayerCard 
              lane={LANES[1]} 
              player={playerObj} 
              hero={getHeroForLaneByLaneKey('mid', lanePlayers)} 
              onClick={() => onPlayerClick({ 
                lane: LANES[1], 
                player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                hero: getHeroForLaneByLaneKey('mid', lanePlayers) 
              })} 
              getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
            />
          );
        })()}
      </div>
      <div className="flex flex-row justify-center w-full">
        {(() => {
          const playerName = getPlayerNameForLane('jungler', 2);
          const playerRole = getRoleByLaneKey('jungler');
          const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
          const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
          return (
            <PlayerCard 
              lane={LANES[2]} 
              player={playerObj} 
              hero={getHeroForLaneByLaneKey('jungler', lanePlayers)} 
              onClick={() => onPlayerClick({ 
                lane: LANES[2], 
                player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                hero: getHeroForLaneByLaneKey('jungler', lanePlayers) 
              })} 
              getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
            />
          );
        })()}
      </div>
      <div className="flex flex-row justify-center gap-x-8 w-full">
        {(() => {
          const playerName = getPlayerNameForLane('gold', 3);
          const playerRole = getRoleByLaneKey('gold');
          const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
          const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
          return (
            <PlayerCard 
              lane={LANES[3]} 
              player={playerObj} 
              hero={getHeroForLaneByLaneKey('gold', lanePlayers)} 
              onClick={() => onPlayerClick({ 
                lane: LANES[3], 
                player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                hero: getHeroForLaneByLaneKey('gold', lanePlayers) 
              })} 
              getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
            />
          );
        })()}
        {(() => {
          const playerName = getPlayerNameForLane('roam', 4);
          const playerRole = getRoleByLaneKey('roam');
          const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
          const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
          return (
            <PlayerCard 
              lane={LANES[4]} 
              player={playerObj} 
              hero={getHeroForLaneByLaneKey('roam', lanePlayers)} 
              onClick={() => onPlayerClick({ 
                lane: LANES[4], 
                player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, 
                hero: getHeroForLaneByLaneKey('roam', lanePlayers) 
              })} 
              getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} 
            />
          );
        })()}
      </div>
    </div>
  );
};

export default PlayerGrid; 