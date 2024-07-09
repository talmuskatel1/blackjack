import React from 'react';
import { Card } from '../types/types';

interface CardComponentProps {
  card: Card;
  className?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, className }) => {
  return (
    <div className={className}>
      <img src={card.imageUrl} alt={`${card.value} of ${card.suit}`} />
    </div>
  );
};

export default CardComponent;
