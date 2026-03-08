import React, { useState, useEffect } from 'react';
import { Dices, ArrowRight } from 'lucide-react';
import type { Player } from '../App';

interface DiceRollerProps {
  currentPlayer: Player;
  onRoll: (steps: number) => void;
  onEndTurn: () => void;
  isFirstRound: boolean;
}

const DiceFace = ({ value, isRolling }: { value: number; isRolling: boolean }) => {
  const getDots = (num: number) => {
    const dotPositions: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
    };
    return dotPositions[num] || [];
  };

  const dots = getDots(value);

  return (
    <div className={`relative w-20 h-20 bg-white rounded-2xl shadow-2xl border-4 border-blue-500 transition-transform duration-100 ${
      isRolling ? 'animate-spin' : 'hover:scale-105'
    }`}>
      <div className="absolute inset-0 p-3">
        <div className="relative w-full h-full">
          {dots.map((position, index) => (
            <div
              key={index}
              className={`absolute w-3 h-3 bg-blue-600 rounded-full shadow-sm ${
                position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                position === 'top-left' ? 'top-0 left-0' :
                position === 'top-right' ? 'top-0 right-0' :
                position === 'bottom-left' ? 'bottom-0 left-0' :
                position === 'bottom-right' ? 'bottom-0 right-0' :
                position === 'middle-left' ? 'top-1/2 left-0 -translate-y-1/2' :
                position === 'middle-right' ? 'top-1/2 right-0 -translate-y-1/2' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export function DiceRoller({ currentPlayer, onRoll, onEndTurn, isFirstRound }: DiceRollerProps) {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  // Reset dice state when player changes
  useEffect(() => {
    setDice1(1);
    setDice2(1);
    setHasRolled(false);
    setIsRolling(false);
  }, [currentPlayer.id]);

  const rollDice = () => {
    setIsRolling(true);
    setHasRolled(false);
    
    // Animate the roll
    let count = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      count++;
      
      if (count > 15) {
        clearInterval(interval);
        const final1 = Math.floor(Math.random() * 6) + 1;
        const final2 = Math.floor(Math.random() * 6) + 1;
        setDice1(final1);
        setDice2(final2);
        setIsRolling(false);
        setHasRolled(true);
        onRoll(final1 + final2);
      }
    }, 80);
  };

  const handleEndTurn = () => {
    setDice1(1);
    setDice2(1);
    setHasRolled(false);
    onEndTurn();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Current Player */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: currentPlayer.color }}
            >
              {currentPlayer.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Turn</p>
              <h3 className="text-lg text-gray-900">{currentPlayer.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Position</p>
            <p className="text-lg">{currentPlayer.currentPosition}</p>
          </div>
        </div>

        {isFirstRound && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 text-center">
              🎯 First Round - Turns auto-advance until all players complete one lap
            </p>
          </div>
        )}

        {/* Dice Display */}
        <div className="flex items-center justify-center gap-4 mb-6 py-6">
          <DiceFace value={dice1} isRolling={isRolling} />
          <DiceFace value={dice2} isRolling={isRolling} />
        </div>

        {hasRolled && (
          <div className="text-center mb-4">
            <p className="text-gray-600">Total Roll</p>
            <p className="text-4xl text-blue-600">
              {dice1 + dice2}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!hasRolled ? (
            <button
              onClick={rollDice}
              disabled={isRolling}
              className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isRolling
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              }`}
            >
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
          ) : !isFirstRound && (
            <button
              onClick={handleEndTurn}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              End Turn
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}