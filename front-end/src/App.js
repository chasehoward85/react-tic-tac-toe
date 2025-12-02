import { useState } from 'react';

import TicTacToeGame from './components/TicTacToeGame';

import './App.css';

function App() {
	const [gameMode, setGameMode] = useState('');

	return (
		<div className="content-container">
			{gameMode ? null : (
				<>
				<button onClick={() => setGameMode('auto')}>Random Game</button>
				<button onClick={() => setGameMode('host')}>Host a Game</button>
				<button onClick={() => setGameMode('join')}>Join a Game</button>
				</>
			)}
			{gameMode === 'auto' && <TicTacToeGame />}
		</div>
	);
}

export default App;
