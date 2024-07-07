// NewGameButton.tsx
import React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
}

const NewGameButton: React.FC<NewGameButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      New Game
    </button>
  );
};

export default NewGameButton;
