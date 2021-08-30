import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Segment, Divider, Grid, Flag, Confirm } from 'semantic-ui-react'

import { useForceUpdate } from './utils.js'

/* S: API ************************************************************/

function validBets(bets) { //U: Checks if the bettor picked a team on every game
	let res = true
	for (const bet of bets) { res &= 0 <= bet && bet <= 2 }
	return res
}

/* S: UI *************************************************************/

function Side({ game, team, side, chosenSide, onChooseTeam }) {
	let hasChosen = chosenSide != -1
	let isChosen = side == chosenSide

	let text
	let color
	let showColor
	let width

	if (side < 2) { //A: Either team
		text = <div><Flag name={team.toLowerCase()} />{team}</div>
		color = side == chosenSide ? 'green' : 'red' //A: Green -> winner, Red -> loser
		showColor = hasChosen
		width = 6
	} else if (side == 2) { //A: Tie
		text = <div>Tie</div>
		color = 'grey'
		showColor = chosenSide == side
		width = 2
	} else if (side == 3) { //A: Info //TODO: Move to a dropdown
		text = <div>Show Info</div>
		showColor = false
		width = 2
	}

	if (showColor) { 
		return (
			<Grid.Column key={side} color={color} width={width} onClick={() => onChooseTeam(game, side)}>
				{text}
			</Grid.Column>
		)
	} else { //A: They haven't picked a team yet
		return (
			<Grid.Column key={side} width={width} onClick={() => onChooseTeam(game, side)}>
				{text}
			</Grid.Column>
		)
	}
}

function Game({ info, game, chosenSide, onChooseTeam }) {
	//TODO: Divider saying vs between sides
	//TODO: Show results for finished games
	const [ showInfo, setShowInfo ] = useState(false)

	const shideInfo = () => { setShowInfo(!showInfo) }

	return (
		<Segment>
			<Grid columns='equal' divided>
				<Grid.Row>
				<Side game={game} team={info.local} side={0} chosenSide={chosenSide} onChooseTeam={onChooseTeam} />
				<Side game={game} team={info.away} side={1} chosenSide={chosenSide} onChooseTeam={onChooseTeam} />
				<Side game={game} team={"tie"} side={2} chosenSide={chosenSide} onChooseTeam={onChooseTeam} />
				<Side game={game} team={"info"} side={3} chosenSide={chosenSide} onChooseTeam={shideInfo} />
				</Grid.Row>
				{showInfo ?
					<Grid.Row>
						<Grid.Column>
							TODO: Info
						</Grid.Column> 
					</Grid.Row>
				: ''}
			</Grid>
		</Segment>
	)
}

function BetsList({ bets, games }) {
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

export default function Bettor({ games, submitBets, library }) {
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
		<div>
			<div>
				<Header as='h1'>Pick your winners</Header>
			</div>
			<Container>
				{games.map((game, i) => (
					<Game key={i} info={game} game={i} chosenSide={bets[i]} onChooseTeam={onChooseTeam}/>
				))}
			</Container>
			<div>
				<Button primary onClick={onClickSubmit} content='Submit' />
				<Confirm open={popup} onConfirm={() => submitBets(bets, library)} onCancel={onClickCancel}
					header="Are you sure?"
					content={<BetsList bets={bets} games={games} />}
				/>	
			</div>
		</div>
	)
}
