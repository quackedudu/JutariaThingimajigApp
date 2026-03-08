import React, { useState } from 'react';
import { Plus, Minus, DollarSign, Trophy, TrendingUp, Home, MapPin, AlertTriangle } from 'lucide-react';
import type { Player, Property } from '../App';

interface PlayerListProps {
  players: Player[];
  onUpdateMoney: (playerId: string, amount: number) => void;
  properties?: Property[];
}

export function PlayerList({ players, onUpdateMoney, properties = [] }: PlayerListProps) {
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const calculateNetWorth = (player: Player): number => {
    const propertyValue = player.properties.reduce((sum, prop) => {
      const property = properties.find(p => p.id === prop.id);
      if (!property) return sum;
      let value = 0;
      if (property.hasLand) value += property.landPrice;
      if (property.hasProperty) value += property.propertyPrice;
      return sum + value;
    }, 0);
    return player.money + propertyValue;
  };

  // Sort players by net worth for rankings
  const sortedPlayers = [...players].sort((a, b) => {
    return calculateNetWorth(b) - calculateNetWorth(a);
  });

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const handleQuickAmount = (playerId: string, amt: number, isAdd: boolean) => {
    onUpdateMoney(playerId, isAdd ? amt : -amt);
  };

  const handleCustomAmount = (playerId: string, isAdd: boolean) => {
    const amt = Number(amount);
    if (amt > 0) {
      onUpdateMoney(playerId, isAdd ? amt : -amt);
      setAmount('');
      setActivePlayer(null);
    }
  };

  const formatMoney = (value: number) => {
    return `RM ${value.toLocaleString()}`;
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl text-gray-800 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Player Rankings
        </h2>
      </div>
      
      {sortedPlayers.map((player, index) => {
        const netWorth = calculateNetWorth(player);
        const propertyCount = player.properties.length;
        const landOnlyCount = player.properties.filter(p => {
          const prop = properties.find(pr => pr.id === p.id);
          return prop?.hasLand && !prop?.hasProperty;
        }).length;
        const builtCount = player.properties.filter(p => {
          const prop = properties.find(pr => pr.id === p.id);
          return prop?.hasProperty;
        }).length;
        
        return (
          <div
            key={player.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
              player.isBankrupt ? 'opacity-60' : ''
            }`}
          >
            {/* Player Header */}
            <div className="p-4 flex items-center justify-between border-b relative" style={{ borderLeftWidth: '4px', borderLeftColor: player.color }}>
              {/* Rank Badge */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white">
                {getRankEmoji(index)}
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white relative"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name[0].toUpperCase()}
                  {player.isBankrupt && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-gray-900 flex items-center gap-2">
                    {player.name}
                    {player.isBankrupt && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Bankrupt
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {landOnlyCount} land
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      {builtCount} built
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg text-gray-900">{formatMoney(player.money)}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Net: {formatMoney(netWorth)}
                </p>
              </div>
            </div>

            {/* Money Controls */}
            {!player.isBankrupt && (
              <div className="p-4 bg-gray-50">
                {activePlayer === player.id ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCustomAmount(player.id, false)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Minus className="w-4 h-4" />
                        Deduct
                      </button>
                      <button
                        onClick={() => handleCustomAmount(player.id, true)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setActivePlayer(null);
                          setAmount('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {quickAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleQuickAmount(player.id, amt, true)}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          +{amt}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {quickAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleQuickAmount(player.id, amt, false)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          -{amt}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setActivePlayer(player.id)}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Custom Amount
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}