import React, { useState, useEffect } from "react";
import { GameSetup } from "./components/GameSetup";
import { PlayerList } from "./components/PlayerList";
import { PropertyManager } from "./components/PropertyManager";
import { MoneyTransfer } from "./components/MoneyTransfer";
import { GameHeader } from "./components/GameHeader";
import { DiceRoller } from "./components/DiceRoller";
import { GameBoard } from "./components/GameBoard";
import { TurnOrderSetup } from "./components/TurnOrderSetup";
import { Toaster } from "./components/Toaster";
import { BackgroundPattern } from "./components/BackgroundPattern";
import { getRandomEvent, getRandomEventType, type GameEvent } from "./utils/events";
import { toast } from "sonner@2.0.3";

export interface Player {
  id: string;
  name: string;
  money: number;
  color: string;
  properties: Property[];
  currentPosition: number;
  turnOrder?: number;
  hasPassedStart?: boolean;
  isBankrupt?: boolean;
}

export interface Property {
  id: string;
  name: string;
  position: number;
  landPrice: number;
  propertyPrice: number;
  rent: number;
  color: string;
  ownerId?: string;
  hasLand: boolean;
  hasProperty: boolean;
}

export interface GameHistory {
  id: string;
  timestamp: number;
  type: 'purchase' | 'sale' | 'rent' | 'transfer' | 'event' | 'bonus';
  description: string;
  amount: number;
  playerId: string;
  playerName: string;
}

type GameView =
  | "setup"
  | "turn-order"
  | "board"
  | "players"
  | "properties"
  | "transfer";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [turnOrderSet, setTurnOrderSet] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentView, setCurrentView] =
    useState<GameView>("board");
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [purchasedThisTurn, setPurchasedThisTurn] =
    useState(false);
  const [rentNotification, setRentNotification] = useState<{
    show: boolean;
    amount: number;
    ownerName: string;
    propertyName: string;
  } | null>(null);
  const [startBonusNotification, setStartBonusNotification] = useState<{
    show: boolean;
    playerName: string;
  } | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [lastAction, setLastAction] = useState<{
    type: string;
    data: any;
  } | null>(null);

  // Auto-save game state to localStorage
  useEffect(() => {
    if (gameStarted && turnOrderSet) {
      const gameState = {
        players,
        properties,
        currentTurnIndex,
        purchasedThisTurn,
        gameHistory,
      };
      localStorage.setItem('bootleg-billionaire-save', JSON.stringify(gameState));
    }
  }, [players, properties, currentTurnIndex, purchasedThisTurn, gameHistory, gameStarted, turnOrderSet]);

  // Load game state from localStorage
  const loadGame = () => {
    const savedGame = localStorage.getItem('bootleg-billionaire-save');
    if (savedGame) {
      try {
        const gameState = JSON.parse(savedGame);
        setPlayers(gameState.players || []);
        setProperties(gameState.properties || []);
        setCurrentTurnIndex(gameState.currentTurnIndex || 0);
        setPurchasedThisTurn(gameState.purchasedThisTurn || false);
        setGameHistory(gameState.gameHistory || []);
        setGameStarted(true);
        setTurnOrderSet(true);
        toast.success("Game loaded successfully!");
      } catch (e) {
        toast.error("Failed to load saved game");
      }
    }
  };

  // Add to game history
  const addToHistory = (entry: Omit<GameHistory, 'id' | 'timestamp'>) => {
    const historyEntry: GameHistory = {
      ...entry,
      id: `history-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setGameHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  // Calculate player net worth (cash + property values)
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

  // Check for bankruptcy
  const checkBankruptcy = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.isBankrupt) return;

    const netWorth = calculateNetWorth(player);
    if (player.money <= 0 && netWorth <= 0) {
      setPlayers(prev =>
        prev.map(p =>
          p.id === playerId ? { ...p, isBankrupt: true } : p
        )
      );
      toast.error(`${player.name} is bankrupt! 💸`, {
        duration: 5000,
      });
    }
  };

  const handleStartGame = (
    newPlayers: Player[],
    gameProperties: Property[],
  ) => {
    setPlayers(newPlayers);
    setProperties(gameProperties);
    setGameStarted(true);
  };

  const handleTurnOrderSet = (orderedPlayers: Player[]) => {
    setPlayers(orderedPlayers);
    setTurnOrderSet(true);
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setTurnOrderSet(false);
    setPlayers([]);
    setProperties([]);
    setCurrentView("board");
    setCurrentTurnIndex(0);
  };

  const getCurrentPlayer = () => {
    if (players.length === 0) return null;
    const sortedPlayers = [...players].sort(
      (a, b) => (a.turnOrder || 0) - (b.turnOrder || 0),
    );
    return sortedPlayers[
      currentTurnIndex % sortedPlayers.length
    ];
  };

  const getCurrentRound = () => {
    // First round means not all players have passed start yet
    const allPlayersPassedStart = players.every(p => p.hasPassedStart);
    return allPlayersPassedStart ? 2 : 1;
  };

  const nextTurn = () => {
    setCurrentTurnIndex((prev) => prev + 1);
    setPurchasedThisTurn(false);
  };

  const movePlayer = (playerId: string, steps: number) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const oldPosition = player.currentPosition;
    const newPosition = (player.currentPosition + steps) % 40;
    const passedStart = oldPosition + steps >= 40;
    
    // Check if landed on special tile (0, 10, 20, 30)
    const isSpecialTile = newPosition === 0 || newPosition === 10 || newPosition === 20 || newPosition === 30;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              currentPosition: newPosition,
              money: passedStart && !p.hasPassedStart ? p.money + 20000 : p.money,
              hasPassedStart: passedStart ? true : p.hasPassedStart,
            }
          : p,
      ),
    );

    // Show start bonus notification
    if (passedStart && !player.hasPassedStart) {
      setTimeout(() => {
        setStartBonusNotification({
          show: true,
          playerName: player.name,
        });
      }, 500);
    }

    // Check for special tile event
    if (isSpecialTile) {
      setTimeout(() => {
        const eventType = getRandomEventType();
        const event = getRandomEvent(eventType);
        setCurrentEvent(event);
        
        // Apply the money change from the event
        updatePlayerMoney(playerId, event.moneyChange);
      }, 600);
    }

    // Check for rent after position update
    setTimeout(() => {
      const property = properties.find(
        (p) => p.position === newPosition,
      );

      if (
        property &&
        property.ownerId &&
        property.ownerId !== playerId &&
        property.hasProperty
      ) {
        const owner = players.find(
          (p) => p.id === property.ownerId,
        );
        if (owner) {
          // Automatically transfer rent
          transferMoney(
            playerId,
            property.ownerId,
            property.rent,
          );

          // Show notification
          setRentNotification({
            show: true,
            amount: property.rent,
            ownerName: owner.name,
            propertyName: property.name,
          });
        }
      }
    }, 100);

    // Auto end turn in first round (before all players complete first lap)
    setTimeout(() => {
      const allPlayersPassedStart = players.every(p => p.hasPassedStart || p.id === playerId && passedStart);
      if (!allPlayersPassedStart) {
        nextTurn();
      }
    }, 1500);
  };

  const updatePlayerMoney = (
    playerId: string,
    amount: number,
  ) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, money: Math.max(0, p.money + amount) }
          : p,
      ),
    );
  };

  const transferMoney = (
    fromId: string,
    toId: string,
    amount: number,
  ) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === fromId)
          return { ...p, money: Math.max(0, p.money - amount) };
        if (p.id === toId)
          return { ...p, money: p.money + amount };
        return p;
      }),
    );
  };

  const buyLand = (playerId: string, propertyId: string) => {
    const property = properties.find(
      (p) => p.id === propertyId,
    );
    if (!property || property.hasLand || purchasedThisTurn)
      return;

    const player = players.find((p) => p.id === playerId);
    if (!player || player.money < property.landPrice) return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              money: p.money - property.landPrice,
            }
          : p,
      ),
    );

    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, ownerId: playerId, hasLand: true }
          : p,
      ),
    );

    setPurchasedThisTurn(true);

    // Add to history
    addToHistory({
      type: 'purchase',
      description: `Bought land on ${property.name}`,
      amount: property.landPrice,
      playerId,
      playerName: player.name,
    });

    // Toast notification
    toast.success(`${player.name} bought land on ${property.name}! 🏗️`);

    // Auto end turn after purchase
    setTimeout(() => {
      nextTurn();
    }, 1000);
  };

  const buyProperty = (
    playerId: string,
    propertyId: string,
  ) => {
    const property = properties.find(
      (p) => p.id === propertyId,
    );
    if (
      !property ||
      !property.hasLand ||
      property.ownerId !== playerId ||
      property.hasProperty ||
      purchasedThisTurn
    )
      return;

    const player = players.find((p) => p.id === playerId);
    if (!player || player.money < property.propertyPrice)
      return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              money: p.money - property.propertyPrice,
              properties: [...p.properties, property],
            }
          : p,
      ),
    );

    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, hasProperty: true } : p,
      ),
    );

    setPurchasedThisTurn(true);

    // Add to history
    addToHistory({
      type: 'purchase',
      description: `Bought property on ${property.name}`,
      amount: property.propertyPrice,
      playerId,
      playerName: player.name,
    });

    // Toast notification
    toast.success(`${player.name} built property on ${property.name}! 🏠`);

    // Auto end turn after purchase
    setTimeout(() => {
      nextTurn();
    }, 1000);
  };

  const sellProperty = (
    playerId: string,
    propertyId: string,
  ) => {
    const property = properties.find(
      (p) => p.id === propertyId,
    );
    if (!property) return;

    let refund = 0;
    if (property.hasProperty) {
      refund = Math.floor(
        (property.landPrice + property.propertyPrice) * 0.5,
      );
    } else if (property.hasLand) {
      refund = Math.floor(property.landPrice * 0.5);
    }

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              money: p.money + refund,
              properties: p.properties.filter(
                (prop) => prop.id !== propertyId,
              ),
            }
          : p,
      ),
    );

    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              ownerId: undefined,
              hasLand: false,
              hasProperty: false,
            }
          : p,
      ),
    );

    // Add to history
    addToHistory({
      type: 'sale',
      description: `Sold property on ${property.name}`,
      amount: refund,
      playerId,
      playerName: players.find(p => p.id === playerId)?.name || 'Unknown',
    });
  };

  if (!gameStarted) {
    return (
      <>
        <Toaster />
        <GameSetup onStartGame={handleStartGame} />
      </>
    );
  }

  if (!turnOrderSet) {
    return (
      <>
        <Toaster />
        <TurnOrderSetup
          players={players}
          onTurnOrderSet={handleTurnOrderSet}
        />
      </>
    );
  }

  const currentPlayer = getCurrentPlayer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster />
      <GameHeader
        onReset={handleResetGame}
        currentPlayer={currentPlayer}
        currentRound={getCurrentRound()}
      />

      {/* Navigation */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b border-blue-700 shadow-lg">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setCurrentView("board")}
            className={`flex-1 px-4 py-3 text-sm transition-all relative overflow-hidden group ${
              currentView === "board"
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {currentView === "board" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
            )}
            <span className="relative z-10">Board</span>
          </button>
          <button
            onClick={() => setCurrentView("players")}
            className={`flex-1 px-4 py-3 text-sm transition-all relative overflow-hidden group ${
              currentView === "players"
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {currentView === "players" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
            )}
            <span className="relative z-10">Players</span>
          </button>
          <button
            onClick={() => setCurrentView("properties")}
            className={`flex-1 px-4 py-3 text-sm transition-all relative overflow-hidden group ${
              currentView === "properties"
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {currentView === "properties" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
            )}
            <span className="relative z-10">Properties</span>
          </button>
          <button
            onClick={() => setCurrentView("transfer")}
            className={`flex-1 px-4 py-3 text-sm transition-all relative overflow-hidden group ${
              currentView === "transfer"
                ? "bg-white/20 text-white backdrop-blur-sm"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {currentView === "transfer" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
            )}
            <span className="relative z-10">Transfer</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-6">
        {currentView === "board" && currentPlayer && (
          <>
            <DiceRoller
              currentPlayer={currentPlayer}
              onRoll={(steps) =>
                movePlayer(currentPlayer.id, steps)
              }
              onEndTurn={nextTurn}
              isFirstRound={getCurrentRound() === 1}
            />
            <GameBoard
              players={players}
              properties={properties}
              currentPlayer={currentPlayer}
              onBuyLand={buyLand}
              onBuyProperty={buyProperty}
              purchasedThisTurn={purchasedThisTurn}
            />
          </>
        )}
        {currentView === "players" && (
          <PlayerList
            players={players}
            onUpdateMoney={updatePlayerMoney}
            properties={properties}
          />
        )}
        {currentView === "properties" && (
          <PropertyManager
            players={players}
            properties={properties}
            onBuyLand={buyLand}
            onBuyProperty={buyProperty}
            onSellProperty={sellProperty}
          />
        )}
        {currentView === "transfer" && (
          <MoneyTransfer
            players={players}
            onTransfer={transferMoney}
          />
        )}
      </div>

      {/* Rent Notification Modal */}
      {rentNotification?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-bounce border-4 border-orange-200 relative overflow-hidden">
            <BackgroundPattern variant="secondary" className="text-orange-300" />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-orange-300">
                <span className="text-4xl">💸</span>
              </div>
              <h3 className="text-2xl text-gray-900 mb-2">
                Rent Paid!
              </h3>
              <p className="text-gray-600 mb-4">
                You landed on{" "}
                <span className="font-semibold">
                  {rentNotification.propertyName}
                </span>
              </p>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 mb-4 border-2 border-orange-200 shadow-inner">
                <p className="text-sm text-gray-600 mb-1">
                  Paid to {rentNotification.ownerName}
                </p>
                <p className="text-4xl text-orange-600">
                  RM {rentNotification.amount.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setRentNotification(null)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Bonus Notification Modal */}
      {startBonusNotification?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-bounce border-4 border-green-200 relative overflow-hidden">
            <BackgroundPattern variant="secondary" className="text-green-300" />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-green-300">
                <span className="text-4xl">🎉</span>
              </div>
              <h3 className="text-2xl text-gray-900 mb-2">
                Passed Start!
              </h3>
              <p className="text-gray-600 mb-4">
                {startBonusNotification.playerName} collected bonus
              </p>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 mb-4 border-2 border-green-200 shadow-inner">
                <p className="text-sm text-gray-600 mb-1">
                  Bonus Received
                </p>
                <p className="text-4xl text-green-600">
                  RM 20,000
                </p>
              </div>
              <button
                onClick={() => setStartBonusNotification(null)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Notification Modal */}
      {currentEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl max-w-sm w-full p-6 border-4 border-purple-200 relative overflow-hidden">
            <BackgroundPattern variant="secondary" className="text-purple-300" />
            <div className="text-center relative z-10">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 ${
                currentEvent.type === 'chance' 
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300' 
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300'
              }`}>
                <span className="text-5xl">{currentEvent.emoji}</span>
              </div>
              
              <div className={`inline-block px-5 py-2 rounded-full text-sm mb-3 shadow-md ${
                currentEvent.type === 'chance'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-300'
              }`}>
                {currentEvent.type === 'chance' ? '🎲 CHANCE' : '🔮 FATE'}
              </div>
              
              <h3 className="text-2xl text-gray-900 mb-2">
                {currentEvent.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {currentEvent.description}
              </p>
              
              <div className={`rounded-2xl p-5 mb-4 border-2 shadow-inner ${
                currentEvent.category === 'lucky'
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                  : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
              }`}>
                <p className="text-sm text-gray-600 mb-1">
                  {currentEvent.category === 'lucky' ? '💚 Lucky Event!' : '💔 Unlucky Event'}
                </p>
                <p className={`text-4xl ${
                  currentEvent.category === 'lucky'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {currentEvent.moneyChange > 0 ? '+' : ''}RM {Math.abs(currentEvent.moneyChange).toLocaleString()}
                </p>
              </div>
              
              <button
                onClick={() => setCurrentEvent(null)}
                className={`w-full text-white py-4 rounded-2xl transition-all shadow-lg ${
                  currentEvent.category === 'lucky'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}