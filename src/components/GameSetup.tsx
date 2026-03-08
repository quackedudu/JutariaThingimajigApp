import React, { useState } from 'react';
import { Plus, Trash2, Play, Sparkles } from 'lucide-react';
import type { Player, Property } from '../App';
import { BackgroundPattern } from './BackgroundPattern';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GameSetupProps {
  onStartGame: (players: Player[], properties: Property[]) => void;
}

const PLAYER_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const DEFAULT_PROPERTIES: Omit<Property, 'id' | 'hasLand' | 'hasProperty'>[] = [
  { name: 'Kuala Lumpur', position: 1, landPrice: 1000, propertyPrice: 1000, rent: 200, color: '#EF4444' },
  { name: 'Penang', position: 3, landPrice: 900, propertyPrice: 900, rent: 180, color: '#EF4444' },
  { name: 'Johor Bahru', position: 6, landPrice: 1100, propertyPrice: 1100, rent: 220, color: '#F59E0B' },
  { name: 'Ipoh', position: 8, landPrice: 800, propertyPrice: 800, rent: 160, color: '#F59E0B' },
  { name: 'Malacca', position: 9, landPrice: 750, propertyPrice: 750, rent: 150, color: '#10B981' },
  { name: 'Kota Kinabalu', position: 11, landPrice: 850, propertyPrice: 850, rent: 170, color: '#10B981' },
  { name: 'Kuching', position: 13, landPrice: 700, propertyPrice: 700, rent: 140, color: '#3B82F6' },
  { name: 'Putrajaya', position: 14, landPrice: 1250, propertyPrice: 1250, rent: 250, color: '#3B82F6' },
  { name: 'Shah Alam', position: 16, landPrice: 650, propertyPrice: 650, rent: 130, color: '#8B5CF6' },
  { name: 'Petaling Jaya', position: 18, landPrice: 950, propertyPrice: 950, rent: 190, color: '#8B5CF6' },
  { name: 'Cyberjaya', position: 19, landPrice: 1050, propertyPrice: 1050, rent: 210, color: '#EC4899' },
  { name: 'Langkawi', position: 21, landPrice: 600, propertyPrice: 600, rent: 120, color: '#EC4899' },
  { name: 'Labuan', position: 23, landPrice: 700, propertyPrice: 700, rent: 140, color: '#14B8A6' },
  { name: 'Seremban', position: 24, landPrice: 650, propertyPrice: 650, rent: 130, color: '#14B8A6' },
  { name: 'Kuantan', position: 26, landPrice: 800, propertyPrice: 800, rent: 160, color: '#F97316' },
  { name: 'Miri', position: 27, landPrice: 750, propertyPrice: 750, rent: 150, color: '#F97316' },
  { name: 'Sandakan', position: 29, landPrice: 700, propertyPrice: 700, rent: 140, color: '#6366F1' },
  { name: 'Alor Setar', position: 31, landPrice: 650, propertyPrice: 650, rent: 130, color: '#6366F1' },
  { name: 'Kangar', position: 32, landPrice: 600, propertyPrice: 600, rent: 120, color: '#EC4899' },
  { name: 'Klang', position: 34, landPrice: 900, propertyPrice: 900, rent: 180, color: '#10B981' },
  { name: 'Subang Jaya', position: 37, landPrice: 950, propertyPrice: 950, rent: 190, color: '#3B82F6' },
  { name: 'Tawau', position: 39, landPrice: 750, propertyPrice: 750, rent: 150, color: '#EF4444' },
];

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [startingMoney, setStartingMoney] = useState(15000);

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter(name => name.trim());
    if (validNames.length < 2) {
      alert('Please add at least 2 players');
      return;
    }

    // Check for duplicate names
    const uniqueNames = new Set(validNames.map(name => name.trim().toLowerCase()));
    if (uniqueNames.size !== validNames.length) {
      alert('Player names must be unique. Please check for duplicates.');
      return;
    }

    const players: Player[] = validNames.map((name, index) => ({
      id: `player-${index}`,
      name: name.trim(),
      money: startingMoney,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      properties: [],
      currentPosition: 0
    }));

    const properties: Property[] = DEFAULT_PROPERTIES.map((prop, index) => ({
      ...prop,
      id: `property-${index}`,
      hasLand: false,
      hasProperty: false
    }));

    onStartGame(players, properties);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Malaysian cityscape */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1595342011782-30a4dde83708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBjaXR5c2NhcGUlMjBLdWFsYSUyMEx1bXB1cnxlbnwxfHx8fDE3NzI5MjY4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
            filter: 'blur(4px)'
          }}
        />
        <BackgroundPattern variant="gold" className="text-yellow-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
      </div>

      <div className="relative min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Title Card with enhanced styling */}
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 border border-white/50 relative overflow-hidden">
            <BackgroundPattern variant="subtle" className="text-blue-600" />
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                <h1 className="text-4xl text-center bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  Bootleg Billionaire
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
              </div>
              <p className="text-center text-gray-600 mb-1">Monopoly Thingimajig</p>
              <p className="text-center text-sm text-gray-500 italic">Malaysian Edition</p>
            </div>
          </div>

          {/* Main Setup Card */}
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50 relative overflow-hidden">
            <BackgroundPattern variant="secondary" className="text-indigo-600" />
            
            <div className="relative z-10">
              {/* Starting Money */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Starting Money (RM)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={startingMoney}
                    onChange={(e) => setStartingMoney(Number(e.target.value))}
                    className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all shadow-sm"
                    min="1000"
                    step="1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl pointer-events-none -z-10" />
                </div>
              </div>

              {/* Players */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-gray-700 flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    Players ({playerNames.length})
                  </label>
                  {playerNames.length < 8 && (
                    <button
                      onClick={addPlayer}
                      className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {playerNames.map((name, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-md ring-2 ring-white"
                        style={{ backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length] }}
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => updatePlayerName(index, e.target.value)}
                          placeholder={`Player ${index + 1} name`}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all group-hover:border-blue-300 shadow-sm"
                        />
                      </div>
                      {playerNames.length > 2 && (
                        <button
                          onClick={() => removePlayer(index)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 text-white py-5 rounded-2xl hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-600 transition-all shadow-2xl flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Game</span>
              </button>
            </div>
          </div>

          {/* Footer decoration */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">🇲🇾 Jutaria Billionaire - Malaysian Edition 🇲🇾</p>
          </div>
        </div>
      </div>
    </div>
  );
}