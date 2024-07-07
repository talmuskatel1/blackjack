// App.tsx
import React from 'react';
import GameBoard from './components/gameBoard';
import './App.css'; // Import your CSS file for styling

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <GameBoard />
      </header>
    </div>
  );
};

export default App;
