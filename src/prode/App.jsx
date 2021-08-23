import React, { useState, useEffect } from 'react'
//import { TextInput } from 'react-native'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3U from 'web3-utils'

import { Contract, ContractFactory } from "@ethersproject/contracts";
import Wager from '../contracts/Wager.json'

/* S: Utils *************************************************/
/* TODO: Mover a otro archivo *******************************/

async function conseguirVarios(comoConseguir, cartelParaLog = '') { //U: Recibe un diccionario de las claves y la funcion que consigue su valor. Y espera a que se cumplan todas las promesas
	const valores = {}
	const promesas = Object.entries(comoConseguir).map(async ([key, func]) => {
		valores[key] = 'buscando'
		try {
			valores[key] = await func()
		} catch (err) {
			console.error(cartelParaLog + ' conseguirVarios error consiguiendo', key, err)
			valores[key] = 'fallo'
		}
		return valores[key] //A: Para que devuelva una promesa
	})
	await Promise.all(promesas)
	console.log(cartelParaLog + ' conseguirVarios', valores)
	
	return valores
}


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

async function SubmitBoard(board, contract) {
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

function ContractInfo({ account, contract }) { //U: UI With a contract's info
	const [info, setInfo] = useState({
		chairperson: '', //A: Owner of the contract
		isOwner: false, //A: Are you the owner?
		started: false, //A: Have the games started?
		done: false, //A: Are the games done?
		totalPool: 0, //A: How much money people have bet
		games: Array(13).fill([0, 0, 0]), //A: How many people have bet for each outcome of each game
	})

	const updateInfo = async () => { //U: Updates the contract's info NOTE: Needed because the promises cause React to update too many times and it crashes
		const comoConseguir = {
			chairperson : async () => (await contract.Chairperson()),
			isOwner : async () => ('no se'),
			started : async () => (await contract.Started()),
			done : async () => (await contract.Done()),
			totalPool : async () => (Web3U.fromWei((await contract.TotalPool())._hex, 'ether')), //A: ._hex because of a bug in how Web3U checks if it's a BigNumber
			games :
				async () => {
					const games = Array(13).fill([0, 0, 0]) //A: Dflt
					for (let i = 0; i < 13; i++) {
						for (let j = 0; j < 3; j++) {
							games[i][j] = await contract.Games(i, j)
						}
					}
					return games
				}
		}

		const newInfo = await conseguirVarios(comoConseguir, 'updateInfo')
		newInfo.isOwner = newInfo.chairperson != 'fallo' && newInfo.chairperson === account
		setInfo(newInfo)
		console.log('updateInfo done', newInfo)
	}

	useEffect(
		() => { updateInfo() }, //A: useEffect espera una funcion que devuelve null u otra funcion para llamar cuando no se muestra mas el componente
		[account, contract] //A: Depende de cuando cambian account o contract
	)

	return (
		<div>
			<h2>Contract Info</h2>
			<div>Owner: {info.chairperson}</div>
			<div>Owned by you: {info.isOwner.toString()}</div>
			<div>Address: {contract.address}</div>
			<div>Started: {info.started.toString()}</div>
			<div>Done: {info.done.toString()}</div>
			<div>Total Pool: {info.totalPool}</div>
			<div>Games: {info.games.join('; ')}</div>
			<button onClick={updateInfo}>Update</button>
		</div>
	)
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
			<h2>Board</h2>
			<div style={{display:"inline-block", border:"1px dotted gray", margin:"5px"}}>
				{boardToComponent()}
			</div>
		</div>
	)
}

function Bettor({ account, library }) {
	const [contract, setContract] = useState(undefined)
	const [address, setAddress] = useState('') 

	const inputAddress = (e) => {
		setAddress(e.target.value)
	}

	const inputContract = () => {
		//TODO: Check if address is valid
		const newContract = new Contract(address, Wager.abi, library.getSigner())
		setContract(newContract)
	}

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
			SubmitBoard(board, contract);
		} else {
			console.log('submitBoard invalid')
			//TODO: Paint red the missing games/extra doubles
		}
	}

	return (
		<div>
			<h1>Bettor</h1>
			{contract ? (
				<div>
					<ContractInfo account={account} contract={contract} />
					<Board board={board} onClickSquare={onClickSquare}/>
					<br/><button onClick={submitBoard}>Submit</button>
				</div>
			) : (
				<div>
					Input contract address:
					<br/><input type="text" value={address} onChange={inputAddress} />
					<br/><button onClick={inputContract}>Send</button>
				</div>
			)}
		</div>
	)
}

/* S: Bet setup & management UI *****************************/
/* TODO: Move to another file *******************************/

function Creator({ account, library }) { //U: UI to setup bets
	const [contract, setContract] = useState(undefined)
	const [address, setAddress] = useState('')

	const inputAddress = (e) => {
		setAddress(e.target.value)
	}

	const inputContract = () => {
		//TODO: Check if address is valid
		const newContract = new Contract(address, Wager.abi, library.getSigner())
		setContract(newContract)
	}

	const onClickCreate = async () => {
		const factory = new ContractFactory(Wager.abi, Wager.bytecode, library.getSigner())
		const contract = await factory.deploy()

		contract.deployTransaction.wait().then( //A: Wait until it's been deployed
			() => setContract(contract)
		)
	}

	const onClickStartGames = async () => {
		await contract.startGames()
	}

	const onClickInputResults = () => {
		//TODO: Board to input the results
	}

	//TODO: Disable buttons if the contract is already marked as started/done/etc
	
	return (
		<div>
			<h1>Creator</h1>
			{contract ? (
					<div>
						<ContractInfo account={account} contract={contract} />
						<div>
							<button onClick={onClickStartGames}>Start Games</button>
							<br/><button onClick={onClickInputResults}>Input Results</button>
						</div>
					</div>
				) :	(
				<div>
					<div>
						Input contract address:
						<br/><input type="text" value={address} onChange={inputAddress} />
						<br/><button onClick={inputContract}>Send</button>
					</div>
					<div>
						Create new contract
						<br/><button onClick={onClickCreate}>Create</button>
					</div>
				</div>
			)}
		</div>
	)
}

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
  const { chainId, account, activate, active, library } = useWeb3React()
	const [mode, setMode] = useState('bettor')

  const onClickActivate = () => {
    activate(injectedConnector)
	}

	const changeMode = () => {
		setMode(mode == 'creator' ? 'bettor' : 'creator')
	}

	if (active) { //A: Let them bet
		return (
			<div>
				{mode == 'creator' ? (
					<div>
						<Creator account={account} library={library} />
					</div>
				) : (
					<div>
						<Bettor account={account} library={library} />
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
				<h1>Wallet activation required</h1>
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
