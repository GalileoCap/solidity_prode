import React, { useState } from 'react'
import { List, Container, Button, Header, Segment, Flag, Confirm } from 'semantic-ui-react'

import { useForceUpdate } from '../utils/utils.js'
import { claimPrize } from '../utils/web3.js'

import { games } from '../data.json'

/* S: API ************************************************************/

function validBets(bets) { //U: Checks if the bettor picked a team on every game
	let res = true
	for (const bet of bets) { res &= 0 <= bet && bet <= 2 }
	return res
}

/* S: Betting UI *****************************************************/

function Game({ info, game, chosenSide, onChooseTeam }) {
	const [ showInfo, setShowInfo ] = useState(false)

	const shideInfo = () => { setShowInfo(!showInfo) }

	const buttonSideComponent = (side) => {
		const team = side == 0 ? info.local : info.away
		const text = <div><Flag name={team.toLowerCase()} />{team}</div>
		const color = side == chosenSide ? 'green' : 'red'

		if (chosenSide != -1) {
			return <Button color={color} onClick={() => onChooseTeam(game, side)} content={text} />
		} else {
			return <Button onClick={() => onChooseTeam(game, side)} content={text} />
		}
	}

	const buttonTieComponent = () => {
		const text = 'Tie'

		if (chosenSide == 2) {
			return <Button color="grey" onClick={() => onChooseTeam(game, 2)} content={text} />
		} else {
			return <Button onClick={() => onChooseTeam(game, 2)} content={text} />
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
				{showInfo ?
					<List.Item>
						TODO: Info
					</List.Item>
				: ''}
			</List>
		</Segment>
	)
}

function BetsList({ bets }) {
	return (
		<div className="content">
			<List>
				{games.map((game, i) => (
					<List.Item key={i}>
						<List.Header>{game.local} vs. {game.away}</List.Header>
						<List.Description>
							{bets[i] == 0 ? game.local : (bets[i] == 1 ? game.away : 'Tie')}
						</List.Description>
					</List.Item>
				))}
			</List>
		</div>
	)
}

export default function Betting({ submitBets, library }) {
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
				{games.map((game, i) => (
					<Game key={i} info={game} game={i} chosenSide={bets[i]} onChooseTeam={onChooseTeam}/>
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
