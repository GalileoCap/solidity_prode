import React, { useState, useEffect } from 'react'
import { Button, List } from 'semantic-ui-react'

import Web3U from 'web3-utils'

import { conseguirVarios } from './utils.js'

export default function ContractInfo({ account, contract }) { //U: UI With a contract's info
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
			<List>
				<List.Item>
					<List.Header>Chairperson</List.Header>
					{info.isOwner ? 'You are the owner' : info.chaiperson}
				</List.Item>
				<List.Item>
					<List.Header>Address</List.Header>
					{contract.address}
				</List.Item>
				<List.Item>
					<List.Header>Started</List.Header>
					{info.started.toString()}	
				</List.Item>
				<List.Item>
					<List.Header>Done</List.Header>
					{info.done.toString()}	
				</List.Item>
				<List.Item>
					<List.Header>TotalPool</List.Header>
					{info.totalPool}	
				</List.Item>
				<List.Item>
					<List.Header>Games</List.Header>
					{info.games.join('; ')}	
				</List.Item>
			</List>
			<Button onClick={updateInfo} content='Update' />
		</div>
	)
}
