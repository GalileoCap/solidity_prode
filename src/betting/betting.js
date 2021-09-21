import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Grid, Confirm, Input } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { useForceUpdate, conseguirVarios } from '../utils/utils.js'
import { submitBets, getFromContract } from '../utils/web3.js'

import { provinces } from '../data.json'

/* S: API ************************************************************/

function validBets(bets) { //U: Checks if the bettor picked a team on every game
	let res = true
	for (const bet of bets) { res &= 0 <= bet && bet <= 2 }
	return res
}

/* S: Betting UI *****************************************************/

function Party({ party, y, pct, setPct }) {
	const [error, setError] = useState(false)

	return (
		<>
			<Grid.Row style={{marginTop: '1.5em'}}>
				<Grid.Column computer={3} mobile={7} color='grey'>
					<Header as='h2' content={party} />
				</Grid.Column>
				<Grid.Column computer={5} mobile={9} color='grey'>
					<Input
						label={{ basic: true, content: '%' }}
						labelPosition='right'
						size='mini'
						type='number'
						placeholder={pct}
						error={error}
						onChange={(e, data) => setPct(y, data.value, setError)}
					/>
				</Grid.Column>
				<Grid.Column only='computer' width={8} color='green'>
					TODO: Slider
				</Grid.Column>
			</Grid.Row>
			<Grid.Row only='tablet mobile' color='green' columns={1}>
				<Grid.Column width={16}>
					TODO: Slider
				</Grid.Column>
			</Grid.Row>
		</>
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

function BettingUi({ province }) {
	const { library } = useWeb3React()
	const parties = provinces[province]

	const [ bets, setBets ] = useState(Array(parties.length).fill(Math.floor(100 / parties.length)))
	const forceUpdate = useForceUpdate() 
	
	const setPct = (y, pct, setError) => {
		console.log('Chose game side bets', y, pct, bets)
		if (0 <= pct && pct <= 100) {
			setError(false)

			const newBets = bets
			newBets[y] = pct
			setBets(newBets)
			//forceUpdate()
		} else {
			setError(true)
		}
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
		<Container style={{textAlign: 'center', marginTop: '6em'}}>
			<Header as='h1' content='Elegí tus apuestas' />
			<Grid divided='vertically'>
				{parties.map((party, y) => (
					<Party key={y} party={party} y={y} pct={bets[y]} setPct={setPct}/>
				))}
			</Grid>
			<Button primary onClick={onClickSubmit} content='Submit' style={{ marginTop: '1.5em' }}/>
			<Confirm open={popup} onConfirm={() => submitBets(bets, library)} onCancel={onClickCancel}
				header="Are you sure?"
				content={<BetsList bets={bets} />}
			/>	
		</Container>
	)
}

export default function Betting({ province }) {
	const { account, active, library } = useWeb3React()

	const [data, setData] = useState({bettor: undefined, started: false, done:false})

	const updateData = async () => {
		const comoConseguir = {
			bettor: async () => ( await getFromContract(['bettor'], library) ),
			started: async () => ( await getFromContract(['started'], library) ),
			done: async () => ( await getFromContract(['done'], library) )
		}

		if (active) { //A: The first time that it loads, account is undefined before activating
			const newData = await conseguirVarios(comoConseguir, 'bettor updateData')
			setData(newData)
			console.log('bettor updateData done', newData)
		} else {
			console.error('bettor not active')
		}
	}

	//useEffect(() => { updateData() }, [account])
	//if (data.bettor.voted || data.started || data.done) {
		//TODO: send to manage or tell them they're late

	//if (data.bettor == undefined || !active) {
		//return <Container />
	//} else {
		return <BettingUi province='Buenos Aires' />
	//}
}
