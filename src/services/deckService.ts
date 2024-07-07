// deckService.ts

import { Card } from '../types/types';

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  
  // Generate all cards in the deck
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value, imageUrl: `/assets/cards/${value}_of_${suit}.png`});
    }
  }

  // Shuffle the deck
  shuffle(deck);

  return deck;
};

export const shuffle = (deck: Card[]): void => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};
