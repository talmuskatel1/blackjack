import React from 'react';

interface HitButtonProps {
  onClick: () => void;
}

const HitButton: React.FC<HitButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Hit
    </button>
  );
};

export default HitButton;
