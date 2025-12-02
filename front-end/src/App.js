import { useState, useEffect } from 'react';

import axios from 'axios';

import TicTacToeGame from './components/TicTacToeGame';
import PreviousGamesList from './components/PreviousGamesList';

import './App.css';

function App() {
	const [gameMode, setGameMode] = useState('');
	const [gameIdText, setGameIdText] = useState('');
	const [gameId, setGameId] = useState();

	const [previousGames, setPreviousGames] = useState([]);

	useEffect(() => {
		const loadPreviousGames = async () => {
			const response = await axios.get('/previous-games');
			const previousGames = response.data;
			
			console.log(previousGames);

			setPreviousGames(previousGames);
		}

		loadPreviousGames();
	}, []);

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
			{gameMode === 'host' && <TicTacToeGame isHost />}
			{gameMode === 'join' && (
				gameId ? (
					<TicTacToeGame gameId={gameId} />
				) : (
					<>
					<input
						type="text"
						placeholder="Enter the ID of the game you want to join"
						value={gameIdText}
						onChange={e => setGameIdText(e.target.value)} />
					
					<button onClick={() => setGameId(gameIdText)}>Join Game</button>
					</>
				)
			)}

			<PreviousGamesList games={previousGames} />
		</div>
	);
}

export default App;
