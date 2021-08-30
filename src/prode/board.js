import React, { useState, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'

import Web3U from 'web3-utils'

/* S: API ***************************************************/

export function UpdateBoard(board, row, col) {
	const newBoard = board.concat()

	const newRow = []
	if (col == 3) { //A: Un/Set as double
		newBoard[row][col] = (newBoard[row][col] == '_') ? 'X' : '_'
	} else { //A: Change to local/tie/away without changing double
		for (let i = 0; i < 3; i++) {
			newBoard[row][i] = (i == col) ? 'X' : '_'
		}
	}

	return newBoard	
}

export function CheckBoard(board) {
	console.log('CheckBoard', board)
	let valid = true

	let doubleCount = 0
	for (let row in board) { //A: Every game has only one of the options selected
		let xCount = 0
		for (let col = 0; col < 3; col++) {
			xCount += board[row][col] == 'X'
		}
		
		if (xCount != 1) {
			console.log('CheckBoard invalid', row)
			valid = false
		}

		doubleCount += board[row][3] == 'X' //A: Double is selected
	}

	if (doubleCount >= 3) { //A: Maximum two doubles
		console.log('CheckBoard invalid doubles')
		valid = false
	}

	return valid
}

export async function SubmitBoard(board, contract) {
	const bets = []
	const doubles = []
	for (let row in board) {
		for (let col = 0; col < 3; col++) {
			if (board[row][col] == 'X') { //A: Set outcome //TODO: This could be an in extra col that we don't show
				bets.push(col)
			}
		}
		
		if (board[row][3] == 'X') { //A: They marked it as a double
			doubles.push(row)
		}
	}

	while (doubles.length < 2) { //A: Doubles has to be of size = 2
		doubles.push(13) //A: Since there's 13 games, this index is out of range
	}

	console.log('Placing bet', bets, doubles)

	const overrides = { value: Web3U.toWei('1.0', 'ether') }
	await contract.placeBet(bets, doubles, overrides)
}

/* S: UI ****************************************************/

function Square({ state, onClick }) {
	return (
		<Grid.Column onClick={onClick}>
			{state}
		</Grid.Column>
	)
}

function Game({ state, row, onClickSquare }) {
	const gameToComponent = () => {
		console.log('gameToComponent', row)

		const thisRow = []
		for (let col in state) {
			thisRow.push(
				<Square
					key={row * 4 + col}
					state={state[col]}
					onClick={() => onClickSquare(row, col)}
				/>
			)
		}

		return thisRow
	}

	return (
		<Grid.Row>
			{gameToComponent()}
		</Grid.Row>
	)
}

export default function Board({ board, onClickSquare }) {
	const boardToComponent = () => {
		console.log('boardToComponent', board)

		const rows = []
		rows.push( //A: Title row //TODO: Move outside of Board
			<Game
				key={-1}
				state={['L', 'T', 'A', 'D']}
				row={-1}
				onClickSquare={() => {}} //A: Empty function
			/>
		)

		for (let row in board) { //A: 13 games
			rows.push(
				<Game
					key={row}
					state={board[row]}
					row={row}
					onClickSquare={onClickSquare}
				/>
			)
		}

		return rows
	}

	return(
		<div>
			<h2>Board</h2>
			<Grid columns={4} divided='vertically'>
				{boardToComponent()}
			</Grid>
		</div>
	)
}
