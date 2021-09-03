import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Segment, Flag, Confirm } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { useForceUpdate, conseguirVarios } from '../utils/utils.js'
import { submitBets, getFromContract } from '../utils/web3.js'

import { games } from '../data.json'

/* S: API ************************************************************/

function validBets(bets) { //U: Checks if the bettor picked a team on every game
	let res = true
	for (const bet of bets) { res &= 0 <= bet && bet <= 2 }
	return res
}

/* S: Betting UI *****************************************************/

function Game({ game, y, chosenSide, onChooseTeam }) {
	const { chainId, account, activate, active, library } = useWeb3React()
	const [ showInfo, setShowInfo ] = useState(false)
	const [ data, setData ] = useState({votes: [0, 0, 0]})

	const shideInfo = () => { setShowInfo(!showInfo) }

	const buttonSideComponent = (side) => {
		const team = side == 0 ? game.local : game.away
		const text = <div><Flag name={team.toLowerCase()} />{team}</div>
		const color = side == chosenSide ? 'green' : 'red'

		if (chosenSide != -1) {
			return <Button color={color} onClick={() => onChooseTeam(y, side)} content={text} />
		} else {
			return <Button onClick={() => onChooseTeam(y, side)} content={text} />
		}
	}

	const buttonTieComponent = () => {
		const text = 'Tie'

		if (chosenSide == 2) {
			return <Button color="grey" onClick={() => onChooseTeam(y, 2)} content={text} />
		} else {
			return <Button onClick={() => onChooseTeam(y, 2)} content={text} />
		}
	}

	const updateData = async () => {
		const comoConseguir = {
			votes: async () => ( (await getFromContract(['game', y], library)).votes ),
		}

		const newData = await conseguirVarios(comoConseguir, 'game updateData')
		setData(newData)
		console.log('game updateData done', newData)
	}
	useEffect(() => updateData(), [showInfo]) //TODO: There's got to be a better way

	const infoComponent = () => {
		if (showInfo) {
			const date = game.info.date //TODO: Timezones 

			return (
				<List.Item>
					<List horizontal>
						<List.Item>
							Date: {date}
						</List.Item>
						<List.Item>
							Local Votes: {Web3U.hexToNumber(data.votes[0]._hex)}
						</List.Item>
						<List.Item>
							Away Votes: {Web3U.hexToNumber(data.votes[1]._hex)}
						</List.Item>
						<List.Item>
							Tie Votes: {Web3U.hexToNumber(data.votes[2]._hex)}
						</List.Item>
					</List>
				</List.Item>
			)
		}
	}


	return (
		<Segment>
			<List>
				<List.Item>
					<List horizontal>
						<List.Item>
							<Button.Group size="big">
								{buttonSideComponent(0)}
								<Button.Or text="vs." />
								{buttonSideComponent(1)}
							</Button.Group>
						</List.Item>
						<List.Item>
							{buttonTieComponent()}
						</List.Item>
							<Button size="small" onClick={shideInfo} content='Show Info' />
						<List.Item>
						</List.Item>
					</List>
				</List.Item>
				{infoComponent()}
			</List>
		</Segment>
	)
}

function BetsList({ bets }) {
	return (
		<div className="content">
			<List>
				{games.map((game, y) => (
					<List.Item key={y}>
						<List.Header>{game.local} vs. {game.away}</List.Header>
						<List.Description>
							{bets[y] == 0 ? game.local : (bets[y] == 1 ? game.away : 'Tie')}
						</List.Description>
					</List.Item>
				))}
			</List>
		</div>
	)
}

export default function Betting() {
	const { chainId, account, activate, active, library } = useWeb3React()

	const [ bets, setBets ] = useState(Array(games.length).fill(-1))
	const forceUpdate = useForceUpdate() 
	
	const onChooseTeam = (game, side) => {
		console.log('Chose game side bets', game, side, bets)
		const newBets = bets
		newBets[game] = side
		setBets(newBets)
		forceUpdate()
	}

	const [ popup, setPopup ] = useState(false)

	const onClickSubmit = () => {
		console.log('onSubmitBets bets', bets)
		if (validBets(bets)) {
			console.log('onSubmitBets valid bets')
			setPopup(true)
		} else {
			console.log('onSubmitBets invalid bets')
			//TODO: Tell the bettor
		}
	}

	const onClickCancel = () => {
		console.log('onClickCancel')
		setPopup(false)
	}

	return (
		<Container>
			<Header as='h1'>Pick your winners</Header>
			<Container>
				{games.map((game, y) => (
					<Game key={y} game={game} y={y} chosenSide={bets[y]} onChooseTeam={onChooseTeam}/>
				))}
			</Container>
			<Button primary onClick={onClickSubmit} content='Submit' style={{ marginTop: '1.5em' }}/>
			<Confirm open={popup} onConfirm={() => submitBets(bets, library)} onCancel={onClickCancel}
				header="Are you sure?"
				content={<BetsList bets={bets} />}
			/>	
		</Container>
	)
}
