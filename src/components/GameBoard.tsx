import React from 'react';
import { MapPin, Home, User } from 'lucide-react';
import type { Player, Property } from '../App';
import { BoardDisplay } from './BoardDisplay';
import { BackgroundPattern } from './BackgroundPattern';

interface GameBoardProps {
  players: Player[];
  properties: Property[];
  currentPlayer: Player;
  onBuyLand: (playerId: string, propertyId: string) => void;
  onBuyProperty: (playerId: string, propertyId: string) => void;
  purchasedThisTurn: boolean;
}

export function GameBoard({ 
  players, 
  properties, 
  currentPlayer,
  onBuyLand,
  onBuyProperty,
  purchasedThisTurn
}: GameBoardProps) {
  const currentProperty = properties.find(p => p.position === currentPlayer.currentPosition);
  
  const formatMoney = (value: number) => {
    return `RM ${value.toLocaleString()}`;
  };

  const getOwnerName = (ownerId?: string) => {
    if (!ownerId) return null;
    return players.find(p => p.id === ownerId)?.name;
  };

  const getOwner = (ownerId?: string) => {
    if (!ownerId) return null;
    return players.find(p => p.id === ownerId);
  };

  const getPlayersAtPosition = (position: number) => {
    return players.filter(p => p.currentPosition === position);
  };

  const canBuyLand = currentProperty && !currentProperty.hasLand && currentPlayer.money >= currentProperty.landPrice && !purchasedThisTurn;
  const canBuyProperty = currentProperty && currentProperty.hasLand && !currentProperty.hasProperty && currentProperty.ownerId === currentPlayer.id && currentPlayer.money >= currentProperty.propertyPrice && !purchasedThisTurn;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Board Display */}
      <BoardDisplay properties={properties} players={players} />

      {/* Current Position Info */}
      {currentProperty ? (
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl overflow-hidden border border-blue-100 relative">
          <BackgroundPattern variant="subtle" className="text-blue-400" />
          <div 
            className="h-4 shadow-inner relative overflow-hidden"
            style={{ backgroundColor: currentProperty.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20" />
          </div>
          
          <div className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow-sm border border-gray-300">
                    Position {currentProperty.position}
                  </span>
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">{currentProperty.name}</h2>
                {currentProperty.ownerId && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full shadow-md border-2 border-white"
                      style={{ backgroundColor: getOwner(currentProperty.ownerId)?.color }}
                    />
                    <p className="text-sm text-gray-600">
                      Owned by {getOwnerName(currentProperty.ownerId)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Property Status */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 shadow-inner border border-blue-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <span className="text-sm">🏗️</span> Land Price
                  </p>
                  <p className="text-lg text-gray-900">{formatMoney(currentProperty.landPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <span className="text-sm">🏠</span> Property Price
                  </p>
                  <p className="text-lg text-gray-900">{formatMoney(currentProperty.propertyPrice)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <span className="text-sm">💰</span> Rent
                </p>
                <p className="text-xl text-emerald-700">{formatMoney(currentProperty.rent)}</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex gap-2 mb-4">
              <div className={`flex-1 py-2 px-3 rounded-xl text-center shadow-sm transition-all ${
                currentProperty.hasLand 
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                <MapPin className="w-4 h-4 inline mr-1" />
                {currentProperty.hasLand ? 'Land Owned' : 'No Land'}
              </div>
              <div className={`flex-1 py-2 px-3 rounded-xl text-center shadow-sm transition-all ${
                currentProperty.hasProperty 
                  ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 border border-indigo-300' 
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                <Home className="w-4 h-4 inline mr-1" />
                {currentProperty.hasProperty ? 'Built' : 'No Building'}
              </div>
            </div>

            {/* Purchase restrictions message */}
            {purchasedThisTurn && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-3 mb-4 shadow-sm">
                <p className="text-sm text-yellow-800 text-center">
                  ⚠️ Already purchased this turn. End turn to continue.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {canBuyLand && (
                <button
                  onClick={() => onBuyLand(currentPlayer.id, currentProperty.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Buy Land - {formatMoney(currentProperty.landPrice)}</span>
                </button>
              )}
              
              {canBuyProperty && (
                <button
                  onClick={() => onBuyProperty(currentPlayer.id, currentProperty.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Build Property - {formatMoney(currentProperty.propertyPrice)}</span>
                </button>
              )}

              {!canBuyLand && !canBuyProperty && !currentProperty.ownerId && !purchasedThisTurn && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                  <p className="text-sm text-gray-600">
                    No purchase available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-yellow-50/30 rounded-2xl shadow-xl p-6 border border-yellow-200 relative overflow-hidden">
          <BackgroundPattern variant="gold" className="text-yellow-400" />
          <div className="text-center relative z-10">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3 shadow-lg border-4 border-yellow-300">
              <MapPin className="w-10 h-10 text-yellow-700" />
            </div>
            <p className="text-xl text-gray-900 mb-2">Position {currentPlayer.currentPosition}</p>
            <p className="text-sm text-gray-500">
              Special tile (Start, Tax, Chance, etc.)
            </p>
          </div>
        </div>
      )}

      {/* Players at Current Position */}
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg p-5 border border-purple-100 relative overflow-hidden">
        <BackgroundPattern variant="subtle" className="text-purple-400" />
        <h3 className="text-gray-700 mb-3 flex items-center gap-2 relative z-10">
          <User className="w-5 h-5" />
          Players at Position {currentPlayer.currentPosition}
        </h3>
        <div className="space-y-2 relative z-10">
          {getPlayersAtPosition(currentPlayer.currentPosition).map(player => (
            <div 
              key={player.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all shadow-sm ${
                player.id === currentPlayer.id 
                  ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 shadow-md' 
                  : 'bg-white/80 backdrop-blur-sm border border-gray-200'
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"
                style={{ backgroundColor: player.color }}
              >
                {player.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{player.name}</p>
                <p className="text-sm text-gray-500">{formatMoney(player.money)}</p>
              </div>
              {player.id === currentPlayer.id && (
                <span className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full shadow-md">
                  Current Turn
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}