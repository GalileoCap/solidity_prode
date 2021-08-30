import React, { useState, useEffect } from 'react'
import { Button, Header, Segment, Divider, Grid } from 'semantic-ui-react'

import { useForceUpdate } from './utils.js'

/* S: UI *************************************************************/

function Side({ game, team, side, chosenSide, onChooseTeam }) {
	const color = side == chosenSide ? 'green' : 'red' //A: Green -> winner, Red -> loser

	if (chosenSide != -1) { //A: If they've already chosen a team show the correct color
		return (
			<Grid.Column key={side} color={color} onClick={() => onChooseTeam(game, side)}>
				<div>{team}</div>
			</Grid.Column>
		)
	} else { //A: They haven't picked a team yet
		return (
			<Grid.Column key={side} onClick={() => onChooseTeam(game, side)}>
				<div>{team}</div>
			</Grid.Column>
		)
	}
}

function Game({ info, game, chosenSide, onChooseTeam }) {
	//TODO: Date and other bets info
	return (
		<div>
			<Segment>
				<Grid columns={2} relaxed='very'>
					<Side game={game} team={info.local} side={0} chosenSide={chosenSide} onChooseTeam={onChooseTeam} />
					<Side game={game} team={info.away} side={1} chosenSide={chosenSide} onChooseTeam={onChooseTeam} />
				</Grid>

				<Divider vertical>vs.</Divider>
			</Segment>
		</div>
	)
}

export default function Bettor({ games, submitBets }) {
	const [ bets, setBets ] = useState(Array(games.length).fill(-1))
	const forceUpdate = useForceUpdate() 
	
	const onChooseTeam = (game, side) => {
		console.log('Chose game side bets', game, side, bets)
		const newBets = bets
		newBets[game] = side
		setBets(newBets)
		forceUpdate()
	}

	const onClickSubmit = () => {
		console.log('onSubmitBets bets', bets)
		if (validBets(bets)) {
			console.log('onSubmitBets valid bets')
			//TODO: Ask if sure
			submitBets()
		} else {
			console.log('onSubmitBets invalid bets')
			//TODO: Tell the bettor
		}
	}

	return (
		<div>
			<div>
				<Header as='h1'>Pick your winners</Header>
			</div>
			<div>
				{games.map((game, i) => (
					<Game key={i} info={game} game={i} chosenSide={bets[i]} onChooseTeam={onChooseTeam}/>
				))}
			</div>
			<div>
				<Button primary onClick={onClickSubmit} content='Submit' />
			</div>
		</div>
	)
}
