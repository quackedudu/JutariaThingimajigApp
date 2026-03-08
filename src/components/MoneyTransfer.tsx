import React, { useState } from 'react';
import { ArrowRight, Send } from 'lucide-react';
import type { Player } from '../App';

interface MoneyTransferProps {
  players: Player[];
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

export function MoneyTransfer({ players, onTransfer }: MoneyTransferProps) {
  const [fromPlayer, setFromPlayer] = useState('');
  const [toPlayer, setToPlayer] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    const transferAmount = Number(amount);
    
    if (!fromPlayer || !toPlayer || fromPlayer === toPlayer) {
      alert('Please select different players');
      return;
    }

    if (transferAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const sender = players.find(p => p.id === fromPlayer);
    if (sender && sender.money < transferAmount) {
      alert(`${sender.name} doesn't have enough money!`);
      return;
    }

    onTransfer(fromPlayer, toPlayer, transferAmount);
    setAmount('');
  };

  const formatMoney = (value: number) => {
    return `RM ${value.toLocaleString()}`;
  };

  const getPlayerById = (id: string) => {
    return players.find(p => p.id === id);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl text-gray-800">Money Transfer</h2>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* From Player */}
        <div>
          <label className="block text-gray-700 mb-2">From</label>
          <select
            value={fromPlayer}
            onChange={(e) => setFromPlayer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">-- Select Player --</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({formatMoney(player.money)})
              </option>
            ))}
          </select>
          {fromPlayer && (
            <div className="mt-2 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPlayerById(fromPlayer)?.color }}
              />
              <p className="text-sm text-gray-600">
                Available: {formatMoney(getPlayerById(fromPlayer)?.money || 0)}
              </p>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="p-3 bg-emerald-100 rounded-full">
            <ArrowRight className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* To Player */}
        <div>
          <label className="block text-gray-700 mb-2">To</label>
          <select
            value={toPlayer}
            onChange={(e) => setToPlayer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">-- Select Player --</option>
            {players.map((player) => (
              <option 
                key={player.id} 
                value={player.id}
                disabled={player.id === fromPlayer}
              >
                {player.name} ({formatMoney(player.money)})
              </option>
            ))}
          </select>
          {toPlayer && (
            <div className="mt-2 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPlayerById(toPlayer)?.color }}
              />
              <p className="text-sm text-gray-600">
                Current: {formatMoney(getPlayerById(toPlayer)?.money || 0)}
              </p>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 mb-2">Amount (RM)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            min="1"
          />
        </div>

        {/* Transfer Button */}
        <button
          onClick={() => handleTransfer()}
          disabled={!fromPlayer || !toPlayer || !amount}
          className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
            fromPlayer && toPlayer && amount
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          Transfer Money
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 Use this for manual payments, buying properties from other players, or any custom transaction.
        </p>
      </div>
    </div>
  );
}