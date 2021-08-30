import React, { useState, useEffect } from 'react'
import { Button, Input } from 'semantic-ui-react'

import { Contract, ContractFactory } from "@ethersproject/contracts"
import Web3U from 'web3-utils'

import ContractInfo from './contract_info.js'
import Board, { UpdateBoard, CheckBoard, SubmitBoard } from './board.js'

import Wager from '../contracts/Wager.json'

export default function Bettor({ account, library }) {
	const [contract, setContract] = useState(undefined)
	const [address, setAddress] = useState('') 

	const inputAddress = (e) => {
		setAddress(e.target.value)
	}

	const inputContract = () => {
		const newContract = new Contract(address, Wager.abi, library.getSigner())
		
			newContract.Done() //A: Check if it's a valid contract
				.then(x => setContract(newContract)) //A: If it is, continue
				.catch(err => console.log('inputContract error', address, err)) //TODO: Tell the user it's invalid
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
					<br/><Button primary onClick={submitBoard} content='Submit' />
				</div>
			) : (
				<div>
					Input contract address:
					<br/><Input placeholder='0x...' value={address} onChange={inputAddress} />
					<br/><Button primary onClick={inputContract} content='Send' />
				</div>
			)}
		</div>
	)
}

export {Bettor}
