export interface Card {
  value: string;
  suit: string;
  imageUrl: string;
}

  
  export interface GameState {
    deck: Card[];
    playerHand: Card[];
    dealerHand: Card[];
    gameStatus: 'waiting' | 'playing' | 'finished';
  }
  