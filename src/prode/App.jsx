import React, { useState } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3U from 'web3-utils'

import { Contract, ContractFactory } from "@ethersproject/contracts";
import Wager from '../contracts/Wager.json'

/* S: Web3 API **********************************************/
/* TODO: Move to another file *******************************/

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
		1337, //A: Local
  ],
})

/* S: Board API *********************************************/
/* TODO: Move to another file *******************************/

function UpdateBoard(board, row, col) {
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

function CheckBoard(board) {
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

async function SubmitBoard(board, library) {
	const contract = new Contract('0xCfEB869F69431e42cdB54A4F4f105C19C080A601', Wager.abi, library.getSigner()) //TODO: Get address as a parameter
	//window.contract = contract //A: Test

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

/* S: Betting UI ********************************************/

function Square({ state, onClick }) {
	return (
		<div onClick={onClick} style={{display: 'inline-block', width: '1.5em'}}>
			{state}
		</div>
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
		<div>
			{gameToComponent()}
		</div>
	)
}

function Board({ board, onClickSquare }) {
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
			{boardToComponent()}
		</div>
	)
}

function Bettor({ library, address }) {
	const boardInitial = [] 
	for (let row = 0; row < 13; row++) {
		boardInitial.push(['_', '_', '_', '_'])
	}
	const [board, setBoard] = useState(boardInitial)

	const onClickSquare = (row, col) => {
		console.log('onClickSquare', row, col, board[row][col])
		setBoard(UpdateBoard(board, row, col))
	}

	const submitBoard = () => {
		console.log('submitBoard', board)

		if (CheckBoard(board)) {
			console.log('submitBoard submitting')
			SubmitBoard(board, library);
		} else {
			console.log('submitBoard invalid')
			//TODO: Paint red the missing games/extra doubles
		}
	}

	return (
		<div>
			<h1>Bettor</h1>
			<div style={{display:"inline-block", border:"1px dotted gray", margin:"5px"}}>
				<Board board={board} onClickSquare={onClickSquare}/>
			</div>
			<div>
				<button onClick={submitBoard}>Submit</button>
			</div>
		</div>
	)
}

/* S: Bet setup UI ******************************************/
/* TODO: Move to another file *******************************/

function Creator({ library }) { //U: UI to setup bets
	const [address, setAddress] = useState(undefined)

	const onClickCreate = async () => {
		const factory = new ContractFactory(Wager.abi, Wager.bytecode, library.getSigner())
		const contract = await factory.deploy()

		contract.deployTransaction.wait().then( //A: Wait until it's been deployed
			() => setAddress(contract.address)
		)
	}

	return (
		<div>
			<h1>Creator</h1>
			{
				address ? (<div>Contract Address: {address}</div>)
				:(<button onClick={onClickCreate}>Create</button>)
			}
		</div>
	)
}

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
  const { chainId, account, activate, active, library } = useWeb3React()
	const [address, setAddress] = useState(undefined)
	const [mode, setMode] = useState('bettor')

  const onClickActivate = () => {
    activate(injectedConnector)
	}

	const changeMode = () => {
		setMode(mode == 'creator' ? 'bettor' : 'creator')
	}

	if (active) { //A: Let them bet
		//TODO: Ask them for the address
		return (
			<div>
				{mode == 'creator' ? (
					<div>
						<Creator library={library} />
					</div>
				) : (
					<div>
						<Bettor library={library} />
					</div>
				)}
				<br />
				<div>
					<div>Account: {account}</div>
					<div>
						<button onClick={changeMode}>Change Role</button>
					</div>
				</div>
			</div>
		)
	} else { //A: Ask them to log in
		return (
			<div>
				<button onClick={onClickActivate}>Activate</button>
			</div>
		)
	}
}

export default function App() {
	const getLibrary = (provider) => {
		const library = new Web3Provider(provider)
		library.pollingInterval = 12000
		return library
	}

  return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<MiddlePerson />
		</Web3ReactProvider>
  )
}
