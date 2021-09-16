import React, { useState, useEffect } from 'react'
import { Icon, Container, Button, Header, List } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { conseguirVarios } from '../utils/utils.js'
import { getFromContract, startGames } from '../utils/web3.js'

import { games } from '../data.json'

/* S: Managing UI ****************************************************/

function GameInfo({ game, y, address }) {
	const { chainId, account, activate, active, library } = useWeb3React()

	const title = `${game.local} vs. ${game.away}`
	const [info, setInfo] = useState({votes: [{_hex: '0x0'}, {_hex: '0x0'}, {_hex: '0x0'}], result: {_hex: '0x0'}})

	const updateInfo = async () => {
		const comoConseguir = {
			votes: async () => ( (await getFromContract(['game', y], library, address)).votes ),
			result: async () => ( (await getFromContract(['game', y], library, address)).result ),
		}

		const newInfo = await conseguirVarios(comoConseguir, 'GameInfo updateInfo')
		setInfo(newInfo)
		console.log('GameInfo updateInfo done', newInfo)
	}
	useEffect(() => updateInfo(), [game]) //TODO: There's got to be a better way

	return (
		<List.Item>
			<List.Header content={title} />
			<List horizontal>
				<List.Item>
					<List.Header content='Local' />
					{Web3U.hexToNumber(info.votes[0]._hex)}
				</List.Item>
				<List.Item>
					<List.Header content='Away' />
					{Web3U.hexToNumber(info.votes[1]._hex)}
				</List.Item>
				<List.Item>
					<List.Header content='Tie' />
					{Web3U.hexToNumber(info.votes[2]._hex)}
				</List.Item>
			</List>
		</List.Item>
	)
}

export default function Managing({ address }) {
	const { chainId, account, activate, active, library } = useWeb3React()
	const [info, setInfo] = useState({totalPool: {_hex: '0x0'}, price: {_hex: '0x0'}, started: false, done: false})

	const updateInfo = async () => {
		const comoConseguir = {
			totalPool: async () => ( (await getFromContract(['totalPool'], library, address)) ),
			price: async () => ( (await getFromContract(['price'], library, address)) ),
			started: async () => ( (await getFromContract(['started'], library, address)) ),
			done: async () => ( (await getFromContract(['done'], library, address)) ),
		}

		const newInfo = await conseguirVarios(comoConseguir, 'Managing updateInfo')
		setInfo(newInfo)
		console.log('Managing updateInfo done', newInfo)
	}
	useEffect(() => updateInfo(), [address]) //TODO: There's got to be a better way

	const getEarnings = () => {
		return (parseFloat(Web3U.fromWei(info.totalPool._hex, 'ether')) / 0.95 * 0.05).toFixed(10)
	}

	const startButton = () => {
		const text = 'Start Games'

		if (!info.started) {
			return  <Button primary content={text} onClick={() => startGames(library) } /> //TODO: Confirm
		} else {
			return <Button disabled secondary content={text} />
		}
	}

	return (
		<Container>
			<Header as='h1' content='Manage Contract' />

			<List>
				<List.Item>
					<List.Header content='Address' />
					{address}
				</List.Item>

				<List.Item>
					<List.Header content='Earnings' />
					<Container>{getEarnings()}<Icon name='ethereum'/></Container>
				</List.Item>

				<List.Item>
					<List.Header content='TotalPool' />
					<Container>{Web3U.fromWei(info.totalPool._hex, 'ether')}<Icon name='ethereum'/></Container>
				</List.Item>

				<List.Item>
					<List.Header content='Price' />
					<Container>{Web3U.fromWei(info.price._hex, 'ether')}<Icon name='ethereum'/></Container>
				</List.Item>

				<List.Item>
					<List.Header content='Games' />
					<List>
						{games.map((game, y) => <GameInfo key={y} address={address} game={game} y={y} />)}
					</List>
				</List.Item>

				<List.Item>
					{startButton()}
				</List.Item>
			</List>
		</Container>
	)
}
