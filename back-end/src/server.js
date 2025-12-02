import http from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url' ;
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

import getNextGameState from './getNextGameState.js';
import {
	RUNNING,
	PLAYER_X_WINS,
	PLAYER_O_WINS,
	DRAW,
} from './gameStates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let expressApp = express();

expressApp.use(express.static(path.join(__dirname, '../../front-end/build')));
expressApp.get('/{*any}', (req, res) => {
	res.sendFile(path.join(__dirname, '../../front-end/build/index.html'));
});

let server = http.createServer(expressApp);
let io = new Server(server, {
	cors: {
		origin: '*',
	}
});

const getStartingMatrix = () => {
	return [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
}

let gamesInProgress = {};

function createNewGame() {
	return {
		id: uuid(),
		playerXSocket: null,
		playerOSocket: null,
		playerXMoves: getStartingMatrix(),
		playerOMoves: getStartingMatrix(),
		currentPlayer: 'X',
	};
}

io.on('connection', socket => {
	const gameWithOnePlayer = Object.values(gamesInProgress).find(game => game.playerXSocket && !game.playerOSocket);
	let game;

	if(gameWithOnePlayer) {		// Second player has joined
		game = gameWithOnePlayer;

		game.playerOSocket = socket;
		game.playerOSocket.emit('start');
		game.playerXSocket.emit('start');
		game.playerOSocket.emit('other player turn');
		game.playerXSocket.emit('your turn');

		console.log(`Player O has joined game ${game.id}! Starting the game...`);

		socket.on('disconnect', () => {
			game.playerOSocket = undefined;

			if(game.playerXSocket) {
				game.playerXSocket.emit('info', 'The other player has disconnected, ending the game...');
				game.playerXSocket.disconnect();
				game.playerXSocket = undefined;
			}

			delete gamesInProgress[game.id];
		});
	}
	else {		// First player has joined
		const newGame = createNewGame();
		gamesInProgress[newGame.id] = newGame;

		newGame.playerXSocket = socket;

		console.log(`Player X has joined ${newGame.id}! Waiting for player O`);

		socket.on('disconnect', () => {
			newGame.playerXSocket = undefined;

			if(newGame.playerOSocket) {
				newGame.playerOSocket.emit('info', 'The other player has disconnected, ending the game...');
				newGame.playerOSocket.disconnect();
				newGame.playerOSocket = undefined;
			}

			delete gamesInProgress[newGame.id];
		});

		game = newGame;
	}

	socket.on('new move', (row, col) => {
		const {
			currentPlayer,
			playerXSocket,
			playerOSocket,
			playerXMoves,
			playerOMoves,
		} = game;

		if(currentPlayer === 'X' && socket == playerXSocket) {
			playerXMoves[row][col] = 1;
			game.currentPlayer = 'O';
		}
		else if(currentPlayer == 'O' && socket == playerOSocket) {
			playerOMoves[row][col] = 1;
			game.currentPlayer = 'X';
		}

		const nextGameState = getNextGameState(playerXMoves, playerOMoves);

		playerOSocket.emit('updated moves', playerXMoves, playerOMoves);
		playerXSocket.emit('updated moves', playerXMoves, playerOMoves);

		if(nextGameState === RUNNING) {
			let currentPlayerSocket = currentPlayer === 'X'
				? playerXSocket
				: playerOSocket;

			let otherPlayerSocket = currentPlayer === 'X'
				? playerOSocket
				: playerXSocket;

			currentPlayerSocket.emit('your turn');
			otherPlayerSocket.emit('other player turn');
		}

		if(nextGameState === PLAYER_X_WINS) {
			playerXSocket.emit('win');
			playerOSocket.emit('lose');

			console.log(`Player X has won game ${game.id}`);

			playerXSocket.disconnect();
			playerOSocket.disconnect();

			delete gamesInProgress[game.id];
		}

		if(nextGameState === PLAYER_O_WINS) {
			playerOSocket.emit('win');
			playerXSocket.emit('lose');

			console.log(`Player O has won game ${game.id}`);

			playerXSocket.disconnect();
			playerOSocket.disconnect();
			
			delete gamesInProgress[game.id];
		}

		if(nextGameState === DRAW) {
			playerXSocket.emit('tie');
			playerOSocket.emit('tie');

			console.log(`Game ${game.id} has tied`);

			playerXSocket.disconnect();
			playerOSocket.disconnect();
			
			delete gamesInProgress[game.id];
		}
	});
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
