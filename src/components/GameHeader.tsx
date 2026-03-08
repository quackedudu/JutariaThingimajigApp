import React from 'react';
import { Menu } from 'lucide-react';
import type { Player } from '../App';

interface GameHeaderProps {
  onReset: () => void;
  currentPlayer?: Player | null;
  currentRound: number;
}

export function GameHeader({ onReset, currentPlayer, currentRound }: GameHeaderProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to end the game and start over?')) {
      onReset();
      setShowMenu(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex-1">
          <h1 className="text-xl">Bootleg Billionaire</h1>
          {currentPlayer && (
            <p className="text-blue-100 text-sm">
              Round {currentRound} • {currentPlayer.name}'s Turn
            </p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  End Game
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}