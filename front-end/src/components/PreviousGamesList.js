import TicTacToeBoard from "./TicTacToeBoard";

import styles from "./styles/PreviousGamesList.module.css"

const PreviousGamesList = ({ games = [] }) => {
	return (
		<div className={styles.previousList}>
			<h3>Previous Games:</h3>
			{games.map(game => (
				<div className={styles.previousListItem}>
					<TicTacToeBoard
						key={game.id}
						playerXMoves={game.playerXMoves}
						playerOMoves={game.playerOMoves} />
				</div>
			))}
		</div>
	);
}

export default PreviousGamesList;
