import React, { useState } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3U from 'web3-utils'

import { Contract } from "@ethersproject/contracts";
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

function getLibrary(provider){
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

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

/* S: UI ****************************************************/

export const Wallet = () => {
  const { chainId, account, activate, active, library } = useWeb3React()
	const [ balance, setBalance ] = useState()

	window.web3 = useWeb3React()
	window.web3u = Web3U

  const onClick = () => {
    activate(injectedConnector)
  }

	const checkBalance = () => {
		const provider = new Web3Provider(library.provider)
		provider.getBalance(account).then(x => setBalance(Web3U.fromWei(x.toString(), 'ether')))
		console.log('checkBalance')
	}

	const interactWithContract = async () => {
		console.log('interactWithContract')
		const contract = new Contract('0xCfEB869F69431e42cdB54A4F4f105C19C080A601', Wager.abi, library.getSigner())
		window.contract = contract

		const overrides = { value: Web3U.toWei('1.0', 'ether') }
		await contract.placeBet(0, overrides)
	}

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
			<div>Balance: {balance}</div>
      {active ? (
				<div>
					<div>Activo</div>
					<button onClick={checkBalance}>Check Balance</button>
					<button onClick={interactWithContract}>Interact with contract</button>
				</div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  )
}

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

export const App = () => {
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
			//TODO: Interact with smart contract
		} else {
			console.log('submitBoard invalid')
			//TODO: Paint red the missing games/extra doubles
		}
	}

  return (
		<div>
			<h1>Prode</h1>
			<div style={{display:"inline-block", border:"1px dotted gray", margin:"5px"}}>
				<Board board={board} onClickSquare={onClickSquare}/>
			</div>
			<div>
				<button onClick={submitBoard}>Submit</button>
			</div>
			<div>
				<Web3ReactProvider getLibrary={getLibrary}>
					<Wallet />
				</Web3ReactProvider>
			</div>
		</div>
  )
}

export default App
