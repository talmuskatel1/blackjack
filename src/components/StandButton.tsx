import React from 'react';

interface StandButtonProps {
  onClick: () => void;
}

const StandButton: React.FC<StandButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Stand
    </button>
  );
};

export default StandButton;
