// GameBoard.tsx

import React, { useState } from 'react';
import StartGameButton from './StartGameButton';
import HitButton from './HitButton';
import StandButton from './StandButton';
import NewGameButton from './NewGameButton';
import CardComponent from './CardComponent';
import { Card } from '../types/types';
import { createDeck } from '../services/deckService';

const GameBoard: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');

  const startGame = () => {
    const newDeck = createDeck();
    const playerCards = dealCards(newDeck, 2);
    const dealerCards = dealCards(newDeck, 1);
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameStatus('ongoing');
  };

  const dealCards = (currentDeck: Card[], numCards: number): Card[] => {
    const cardsDealt = currentDeck.slice(0, numCards);
    currentDeck.splice(0, numCards);
    return cardsDealt;
  };

  const hit = () => {
    const newPlayerHand = [...playerHand, deck[0]];
    const newDeck = deck.slice(1);
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
  };
  const stand = () => {
    // If dealer only has one card, reveal the second card
    if (dealerHand.length === 1) {
      const newDealerHand = [...dealerHand, deck[0]];
      const newDeck = deck.slice(1);
      setDealerHand(newDealerHand);
      setDeck(newDeck);
    }
  
    // Define a function for dealer drawing cards until total is 17 or higher
    const drawDealerCards = () => {
      let currentDealerHand = [...dealerHand];
  
      while (calculateHandValue(currentDealerHand) < 17) {
        currentDealerHand = [...currentDealerHand, deck[0]];
        const newDeck = deck.slice(1);
        setDealerHand(currentDealerHand);
        setDeck(newDeck);
      }
  
      return currentDealerHand;
    };
  
    // Update dealer hand and determine winner
    const updatedDealerHand = drawDealerCards();
  
    // If dealer has an Ace, dynamically adjust its value
    const hasAce = updatedDealerHand.some(card => card.value === 'ace');
    if (hasAce) {
      let adjustedValue = calculateHandValue(updatedDealerHand);
  
      if (adjustedValue <= 11 && adjustedValue + 10 <= 21) {
        adjustedValue += 10;
      }
  
      const updatedHandWithAce = updatedDealerHand.map(card => {
        if (card.value === 'ace') {
          return { ...card, value: '11' }; // Assuming '11' represents an Ace valued at 11
        }
        return card;
      });
  
      setDealerHand(updatedHandWithAce);
    }
  
    // Determine winner after dealer stops drawing
    determineWinner();
  };
  

  const newGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
  };

  const calculateHandValue = (hand: Card[]): number => {
    let total = 0;
    let aceCount = 0;

    for (let card of hand) {
      if (card.value === 'ace') {
        aceCount++;
      } else if (['jack', 'queen', 'king'].includes(card.value)) {
        total += 10;
      } else {
        total += Number(card.value);
      }
    }

    for (let i = 0; i < aceCount; i++) {
      if (total + 11 <= 21) {
        total += 11;
      } else {
        total += 1;
      }
    }

    return total;
  };

  const determineWinner = () => {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (playerTotal > 21) {
      setGameStatus('Dealer wins!');
    } else if (dealerTotal > 21) {
      setGameStatus('Player wins!');
    } else if (playerTotal > dealerTotal) {
      setGameStatus('Player wins!');
    } else if (dealerTotal >= playerTotal) {
      setGameStatus('Dealer wins!');
    }
  };

  return (
    <div className="game-board">

<div className="dealer-area">
        <h2>Dealer</h2>
        <div className="cards">
          {dealerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
      </div>
      {gameStatus && (
        <div className="game-status">
          <h3>{gameStatus}</h3>
        </div>
      )}
      
      <div className="player-area">
        <h2>Player</h2>
        <div className="cards">
          {playerHand.map((card, index) => (
            <CardComponent key={index} card={card} />
          ))}
        </div>
        <div className="actions">
          {!gameStatus && <StartGameButton onClick={startGame} />}
          {gameStatus === 'ongoing' && <HitButton onClick={hit} />}
          {gameStatus === 'ongoing' && <StandButton onClick={stand} />}
          {gameStatus && <NewGameButton onClick={newGame} />}
        </div>
      </div>

    </div>
  );
};

export default GameBoard;