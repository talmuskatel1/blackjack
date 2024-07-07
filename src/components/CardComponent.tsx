import React from 'react';
import { Card } from '../types/types';

interface CardProps {
  card: Card;
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="card">
      <img src={`/assets/cards/${card.value}_of_${card.suit}.png`} alt={`${card.value} of ${card.suit}`} />
    </div>
  );
};

export default CardComponent;
