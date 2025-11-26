import {
	RUNNING,
	PLAYER_X_WINS,
	PLAYER_O_WINS,
	DRAW,
} from './gameStates.js';

const isHorizontalWin = (moves) => {
	return moves.some(row => row.every(x => x));
}

const isVerticalWin = (moves) => {
	return [0, 1, 2].some(colNum =>
		moves.every(row => row[colNum])
);
}

const isDiagonalWin = (moves) => {
	return (moves[0][0] && moves[1][1] && moves[2][2]) || (moves[0][2] && moves[1][1] && moves[2][0]);
}

const isCornersWin = (moves) => {
	return moves[0][0] && moves[0][2] && moves[2][0] && moves[2][2];
}

const boardIsFull = (xMoves, oMoves) => {
	return [0, 1, 2].every(rowNum => {
		return [0, 1, 2].every(colNum => {
			return xMoves[rowNum][colNum] || oMoves[rowNum][colNum];
		});
	});
}

const getNextGameState = (playerXMoves, playerOMoves) => {
	const playerXWins = isHorizontalWin(playerXMoves) || isVerticalWin(playerXMoves) || isDiagonalWin(playerXMoves) || isCornersWin(playerXMoves);
	if(playerXWins) {
		return PLAYER_X_WINS;
	}

	const playerOWins = isHorizontalWin(playerOMoves) || isVerticalWin(playerOMoves) || isDiagonalWin(playerOMoves) || isCornersWin(playerOMoves);
	if(playerOWins) {
		return PLAYER_O_WINS;
	}

	const draw = boardIsFull(playerXMoves, playerOMoves);;
	if(draw) {
		return DRAW;
	}

	return RUNNING;
}

export default getNextGameState;
