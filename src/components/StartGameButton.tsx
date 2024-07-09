// StartGameButton.tsx

import React from 'react';

interface StartGameButtonProps {
  onClick: () => void;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({ onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      Start Game
    </button>
  );
};

export default StartGameButton;
