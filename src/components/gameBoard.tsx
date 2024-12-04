import React, { useEffect, useState } from 'react';
import CardComponent from './CardComponent';
import { Card, GameState } from '../types/types';
import './GameBoard.css';
import { calculateHandValue } from '../utils/CalculateHandValue';
import Button from './Button';
import axios from 'axios';

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
    const response = await axios.get('http://localhost:3001/api/game/initial-state');
    const data = response.data;
    setPlayerHand(data.playerHand);
    setDealerHand(data.dealerHand);
    setGameState(data);
    setLoading(false);
    setRevealedCards({ player: new Array(data.playerHand.length).fill(true), dealer: new Array(data.dealerHand.length).fill(true) });
  };

  useEffect(() => {
    fetchInitialState();
  }, []);

  const handleHit = async () => {
    const response = await axios.post('http://localhost:3001/api/game/hit');
    const data = response.data;
    setPlayerHand(data.playerHand);
    setGameState(data);
    setWinner(data.winner);
    setRevealedCards(prev => ({
      ...prev,
      player: [...prev.player, true]
    }));
  };

  const handleStand = async () => {
    const response = await axios.post('http://localhost:3001/api/game/stand');
    const data = response.data;
    setDealerHand(data.dealerHand);
    setGameState(data);
    setWinner(data.winner);
    setRevealedCards(prev => ({
      ...prev,
      dealer: new Array(data.dealerHand.length).fill(true)
    }));
  };

  const handleNewGame = async () => {
    const response = await axios.get('http://localhost:3001/api/game/new-game');
    const data = response.data;
    if (data.deck.length < 10) {
      handleNewSession();
    } else {
      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
      setGameState(data);
      setWinner('');
      setRevealedCards({ player: new Array(data.playerHand.length).fill(true), dealer: new Array(data.dealerHand.length).fill(true) });
    }
  };

  const handleNewSession = async () => {
    const response = await axios.post('http://localhost:3001/api/game/new-session');
    const data = response.data;
    setPlayerHand(data.playerHand);
    setDealerHand(data.dealerHand);
    setGameState(data);
    setWinner('');
    setRevealedCards({ player: new Array(data.playerHand.length).fill(true), dealer: new Array(data.dealerHand.length).fill(true) });
  };

  return (
    <div className="game-board">
      <div className="dealer-area">
        <h2 className="centered-text">Dealer</h2>
        <div className="score dealer-score">Score: {calculateHandValue(dealerHand)}</div>
        <div className="cards">
          {dealerHand.map((card, index) => (
            <CardComponent key={index} card={card} className='card' />
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
          <h3>{gameState.deck.length}</h3>
        </div>
      )}
      <div className="player-area">
        <h2 className="centered-text">Player</h2>
        <div className="score player-score">Score: {calculateHandValue(playerHand)}</div>
        <div className="cards">
          {playerHand.map((card, index) => (
            <CardComponent key={index} card={card} className='card' />
          ))}
        </div>
        <div className="actions">
          {gameState.gameStatus === 'playing' && <Button text='Hit' onClick={handleHit} />}
          {gameState.gameStatus === 'playing' && <Button text='Stand' onClick={handleStand} />}
          {gameState.gameStatus && <Button text='New Session' onClick={handleNewSession} />}
          {<Button onClick={handleNewGame} text='New Game'></Button>}
        </div>
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default GameBoard;
