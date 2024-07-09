import React, { useEffect, useState } from 'react';
import StartGameButton from './StartGameButton';
import HitButton from './HitButton';
import StandButton from './StandButton';
import NewGameButton from './NewGameButton';
import CardComponent from './CardComponent';
import { Card, GameState } from '../types/types';
import './GameBoard.css';
import { calculateHandValue } from '../utils/CalculateHandValue';

const GameBoard: React.FC = () => {
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    dealerHand: [],
    gameStatus: 'waiting'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>('');
  const [revealedCards, setRevealedCards] = useState<{ player: boolean[], dealer: boolean[] }>({ player: [], dealer: [] });

  const fetchInitialState = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:3001/api/game/initial-state');
    const data = await response.json();
    setPlayerHand(data.playerHand);
    setDealerHand(data.dealerHand);
    setGameState(data);
    setLoading(false);
    setRevealedCards({ player: new Array(data.playerHand.length).fill(false), dealer: new Array(data.dealerHand.length).fill(false) });
  };

  useEffect(() => {
    fetchInitialState();
  }, []);

  const revealNextCard = (hand: 'player' | 'dealer', delay: number) => {
    setTimeout(() => {
      setRevealedCards(prev => {
        const updatedHand = [...prev[hand]];
        const index = updatedHand.findIndex(revealed => !revealed);
        if (index !== -1) {
          updatedHand[index] = true;
          if (index < updatedHand.length - 1) {
            revealNextCard(hand, delay);
          }
        }
        return { ...prev, [hand]: updatedHand };
      });
    }, delay);
  };

  useEffect(() => {
    if (playerHand.length > 0) revealNextCard('player', 500);
    if (dealerHand.length > 0) revealNextCard('dealer', 1000);
  }, [playerHand, dealerHand]);

  const handleHit = async () => {
    const response = await fetch('http://localhost:3001/api/game/hit', {
      method: 'POST',
    });
    const data = await response.json();
    setPlayerHand(data.playerHand);
    setGameState(data);
    setWinner(data.winner);
    revealNextCard('player', 500);
  };

  const handleStand = async () => {
    const response = await fetch('http://localhost:3001/api/game/stand', {
      method: 'POST',
    });
    const data = await response.json();
    setDealerHand(data.dealerHand);
    setGameState(data);
    setWinner(data.winner);
    revealNextCard('dealer', 1000);
  };

  const handleNewGame = async () => {
    const response = await fetch('http://localhost:3001/api/game/new-game', {
      method: 'POST',
    });
    const data = await response.json();
    setPlayerHand(data.playerHand);
    setDealerHand(data.dealerHand);
    setGameState(data);
    setWinner('');
    setRevealedCards({ player: new Array(data.playerHand.length).fill(false), dealer: new Array(data.dealerHand.length).fill(false) });
  };

  return (
    <div className="game-board">
      <div className="dealer-area">
        <h2 className="centered-text">Dealer</h2>
        <div className="score dealer-score">Score: {calculateHandValue(dealerHand)}</div>
        <div className="cards">
          {dealerHand.map((card, index) => (
            <CardComponent key={index} card={card} className={revealedCards.dealer[index] ? 'card flip' : 'card'} />
          ))}
        </div>
      </div>
      {winner && (
        <div className="game-outcome">
          <h3>{winner === 'Tie' ? "It's a tie!" : `${winner} won!`}</h3>
        </div>
      )}
      {!winner && gameState.gameStatus && (
        <div className="game-status">
          <h3>{gameState.gameStatus}</h3>
        </div>
      )}
      <div className="player-area">
        <h2 className="centered-text">Player</h2>
        <div className="score player-score">Score: {calculateHandValue(playerHand)}</div>
        <div className="cards">
          {playerHand.map((card, index) => (
            <CardComponent key={index} card={card} className={revealedCards.player[index] ? 'card flip' : 'card'} />
          ))}
        </div>
        <div className="actions">
          {!gameState.gameStatus && <StartGameButton onClick={fetchInitialState} />}
          {gameState.gameStatus === 'playing' && <HitButton onClick={handleHit} />}
          {gameState.gameStatus === 'playing' && <StandButton onClick={handleStand} />}
          {gameState.gameStatus && <NewGameButton onClick={handleNewGame} />}
        </div>
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default GameBoard;
