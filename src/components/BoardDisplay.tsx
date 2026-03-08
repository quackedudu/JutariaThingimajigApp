import React from 'react';
import { Home, MapPin } from 'lucide-react';
import type { Player, Property } from '../App';

interface BoardDisplayProps {
  properties: Property[];
  players: Player[];
}

export function BoardDisplay({ properties, players }: BoardDisplayProps) {
  const getPlayersAtPosition = (position: number) => {
    return players.filter(p => p.currentPosition === position);
  };

  // Determine if a position is a special tile (Start, corners, etc.)
  const isSpecialTile = (position: number) => {
    // Positions 0, 10, 20, 30 are special corner tiles
    return position === 0 || position === 10 || position === 20 || position === 30;
  };

  // Get tile background color
  const getTileColor = (position: number, property?: Property) => {
    if (isSpecialTile(position)) {
      return '#FCD34D'; // yellow for special tiles
    }
    if (property) {
      return property.color; // property color
    }
    return '#9CA3AF'; // grey for non-property tiles
  };

  // Create a 40-tile board layout
  const tiles = Array.from({ length: 40 }, (_, i) => {
    const property = properties.find(p => p.position === i);
    const playersHere = getPlayersAtPosition(i);
    
    return {
      position: i,
      property,
      players: playersHere,
    };
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-gray-700 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Game Board
        </h3>

        {/* Board Grid - Monopoly style layout */}
        <div className="space-y-1">
          {/* Top Row (positions 30-20) - reading right to left */}
          <div className="grid grid-cols-11 gap-1">
            {tiles.slice(20, 31).reverse().map((tile) => (
              <div
                key={tile.position}
                className="aspect-square rounded-lg flex flex-col items-center justify-center relative text-[8px] p-0.5"
                style={{
                  backgroundColor: getTileColor(tile.position, tile.property),
                  border: '1px solid #fff'
                }}
              >
                <span className="text-white font-bold drop-shadow-md">{tile.position}</span>
                {tile.property?.hasProperty && (
                  <Home className="w-2 h-2 text-white absolute bottom-0" />
                )}
                {tile.property?.hasLand && !tile.property?.hasProperty && (
                  <MapPin className="w-2 h-2 text-white absolute bottom-0" />
                )}
                {tile.players.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 flex gap-0.5">
                    {tile.players.map((player, idx) => (
                      <div
                        key={player.id}
                        className="w-2 h-2 rounded-full border border-white"
                        style={{ backgroundColor: player.color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Middle Rows - Left (31-39) and Right (11-19) sides */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => {
            const leftTile = tiles[31 + row];
            const rightTile = tiles[19 - row]; // Changed back to 19 - row to reverse the order
            
            return (
              <div key={row} className="grid grid-cols-11 gap-1">
                {/* Left tile */}
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center relative text-[8px] p-0.5"
                  style={{
                    backgroundColor: getTileColor(leftTile.position, leftTile.property),
                    border: '1px solid #fff'
                  }}
                >
                  <span className="text-white font-bold drop-shadow-md">{leftTile.position}</span>
                  {leftTile.property?.hasProperty && (
                    <Home className="w-2 h-2 text-white absolute bottom-0" />
                  )}
                  {leftTile.property?.hasLand && !leftTile.property?.hasProperty && (
                    <MapPin className="w-2 h-2 text-white absolute bottom-0" />
                  )}
                  {leftTile.players && leftTile.players.length > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 flex gap-0.5">
                      {leftTile.players.map((player, idx) => (
                        <div
                          key={player.id}
                          className="w-2 h-2 rounded-full border border-white"
                          style={{ backgroundColor: player.color }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Empty middle space */}
                <div className="col-span-9 bg-blue-50 rounded flex items-center justify-center">
                  <span className="text-blue-200 text-[10px] font-bold">BOOTLEG</span>
                </div>

                {/* Right tile */}
                <div
                  className="aspect-square rounded-lg flex flex-col items-center justify-center relative text-[8px] p-0.5"
                  style={{
                    backgroundColor: getTileColor(rightTile.position, rightTile.property),
                    border: '1px solid #fff'
                  }}
                >
                  <span className="text-white font-bold drop-shadow-md">{rightTile.position}</span>
                  {rightTile.property?.hasProperty && (
                    <Home className="w-2 h-2 text-white absolute bottom-0" />
                  )}
                  {rightTile.property?.hasLand && !rightTile.property?.hasProperty && (
                    <MapPin className="w-2 h-2 text-white absolute bottom-0" />
                  )}
                  {rightTile.players && rightTile.players.length > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 flex gap-0.5">
                      {rightTile.players.map((player, idx) => (
                        <div
                          key={player.id}
                          className="w-2 h-2 rounded-full border border-white"
                          style={{ backgroundColor: player.color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Bottom Row (positions 0-10) - reading left to right */}
          <div className="grid grid-cols-11 gap-1">
            {tiles.slice(0, 11).map((tile) => (
              <div
                key={tile.position}
                className="aspect-square rounded-lg flex flex-col items-center justify-center relative text-[8px] p-0.5"
                style={{
                  backgroundColor: getTileColor(tile.position, tile.property),
                  border: '1px solid #fff'
                }}
              >
                <span className="text-white font-bold drop-shadow-md">{tile.position}</span>
                {tile.property?.hasProperty && (
                  <Home className="w-2 h-2 text-white absolute bottom-0" />
                )}
                {tile.property?.hasLand && !tile.property?.hasProperty && (
                  <MapPin className="w-2 h-2 text-white absolute bottom-0" />
                )}
                {tile.players.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 flex gap-0.5">
                    {tile.players.map((player, idx) => (
                      <div
                        key={player.id}
                        className="w-2 h-2 rounded-full border border-white"
                        style={{ backgroundColor: player.color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-xs text-gray-600 mb-2">Legend:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-gray-600" />
              <span className="text-gray-600">Land</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-3 h-3 text-gray-600" />
              <span className="text-gray-600">Building</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded" />
              <span className="text-gray-600">Special</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded" />
              <span className="text-gray-600">Non-property</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-gray-600 mb-1">Player Colors:</p>
            <div className="flex flex-wrap gap-2">
              {players.map(player => (
                <div key={player.id} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="text-xs text-gray-600">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}