import styles from './styles/TicTacToeBoard.module.css'

const TicTacToeBoard = ({
	playerXMoves,
	playerOMoves,
	onClickCell,
}) => {
	const spaceIsTaken = (row, col) => {
		return playerXMoves[row][col] || playerOMoves[row][col];
	}

	const cellStyles = [
		['', `${styles.verticalLines}`, ''],
		[`${styles.horizontalLines}`, `${styles.verticalLines} ${styles.horizontalLines}`, `${styles.horizontalLines}`],
		['', `${styles.verticalLines}`, ''],
	]

	return (
		<>
		<table>
			<tbody>
				{[0, 1, 2].map(row => (
					<tr key={row}>
						{[0, 1, 2].map(col => (
							<td
								key={`${row},${col}`}
								className={`${cellStyles[row][col]} ${spaceIsTaken(row, col) || !onClickCell ? '' : `${styles.emptyCell}`}`}
								onClick={() => {
									if(!spaceIsTaken(row, col) && onClickCell) {
										onClickCell(row, col)
									}
								}}
							>
								{playerXMoves[row][col] ? 'X' : ''}
								{playerOMoves[row][col] ? 'O' : ''}
							</td>
						))}
					</tr>
				))}
			</tbody>	
		</table>
		</>
	);
}

export default TicTacToeBoard;
