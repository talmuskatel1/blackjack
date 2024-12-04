import axios from 'axios';

export const fetchInitialGameState = async () => {
  const response = await axios.get('http://localhost:3000/api/game/initial-state');
  console.log('Initial Game State:', response.data);  
  return response.data;
};
