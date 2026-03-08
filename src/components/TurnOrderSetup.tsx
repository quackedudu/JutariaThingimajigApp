import React, { useState } from 'react';
import { Dices, Play } from 'lucide-react';
import type { Player } from '../App';
import { BackgroundPattern } from './BackgroundPattern';

interface TurnOrderSetupProps {
  players: Player[];
  onTurnOrderSet: (orderedPlayers: Player[]) => void;
}

export function TurnOrderSetup({ players, onTurnOrderSet }: TurnOrderSetupProps) {
  const [rolls, setRolls] = useState<Record<string, number>>({});
  const [currentRolling, setCurrentRolling] = useState<string | null>(null);

  const rollDice = (playerId: string) => {
    setCurrentRolling(playerId);
    
    // Animate the roll
    let count = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      setRolls(prev => ({ ...prev, [playerId]: tempRoll }));
      count++;
      
      if (count > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
        setRolls(prev => ({ ...prev, [playerId]: finalRoll }));
        setCurrentRolling(null);
      }
    }, 100);
  };

  const handleStartGame = () => {
    if (Object.keys(rolls).length !== players.length) {
      alert('All players must roll the dice!');
      return;
    }

    // Sort players by roll (highest first)
    const orderedPlayers = [...players].map(player => ({
      ...player,
      turnOrder: 0
    })).sort((a, b) => (rolls[b.id] || 0) - (rolls[a.id] || 0));

    // Assign turn order
    const playersWithOrder = orderedPlayers.map((player, index) => ({
      ...player,
      turnOrder: index + 1
    }));

    onTurnOrderSet(playersWithOrder);
  };

  const allRolled = Object.keys(rolls).length === players.length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
        <BackgroundPattern variant="primary" className="text-white" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent" />
      </div>

      <div className="relative min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50 relative overflow-hidden">
            <BackgroundPattern variant="subtle" className="text-indigo-600" />
            
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4 shadow-lg border-4 border-blue-200">
                <Dices className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                Determine Turn Order
              </h1>
              <p className="text-gray-600 mb-2">
                Each player rolls the dice. Highest roll goes first!
              </p>
              <p className="text-xs text-gray-500 italic">
                Bootleg Billionaire Monopoly Thingimajig
              </p>
            </div>

            {/* Players */}
            <div className="space-y-3 mb-6 relative z-10">
              {players.map((player) => {
                const hasRolled = rolls[player.id] !== undefined;
                const isRolling = currentRolling === player.id;
                
                return (
                  <div
                    key={player.id}
                    className={`bg-gradient-to-br rounded-2xl p-4 border-2 shadow-md transition-all ${
                      hasRolled 
                        ? 'from-white to-blue-50/50' 
                        : 'from-gray-50 to-gray-100'
                    }`}
                    style={{ 
                      borderColor: hasRolled ? player.color : '#E5E7EB'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"
                          style={{ backgroundColor: player.color }}
                        >
                          {player.name[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-gray-900">{player.name}</h3>
                          {hasRolled && (
                            <p className="text-sm text-gray-500">Rolled</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {hasRolled && (
                          <div className="text-right">
                            <div className="text-4xl" style={{ color: player.color }}>
                              {rolls[player.id]}
                            </div>
                          </div>
                        )}
                        
                        {!hasRolled && (
                          <button
                            onClick={() => rollDice(player.id)}
                            disabled={isRolling}
                            className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md ${
                              isRolling
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                            }`}
                          >
                            <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                            Roll
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Start Button */}
            {allRolled && (
              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-2xl flex items-center justify-center gap-2 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Game</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}