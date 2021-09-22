import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Grid, Confirm, Input } from 'semantic-ui-react'
import { Slider } from '@mui/material'

import { useWeb3React } from '@web3-react/core'

import { useForceUpdate, conseguirVarios } from '../utils/utils.js'

import { provinces } from '../data.json'

function Party({ party, y, pct, setPct }) {
	const [error, setError] = useState(false)
	const [value, setValue] = useState(pct)
	const forceUpdate = useForceUpdate()

	const onChange = (value) => {
		setPct(y, parseFloat(value), setError)
		setValue(value)
	}

	const sliderComponent = <Slider value={value} valueLabelDisplay='auto' onChange={(e, value) => onChange(value)} />

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
						error={error}
						value={value}
						onChange={(e, data) => onChange(data.value)}
					/>
				</Grid.Column>
				<Grid.Column only='computer' width={8} color='green'>
					{sliderComponent}
				</Grid.Column>
			</Grid.Row>
			<Grid.Row only='tablet mobile' color='green' columns={1}>
				<Grid.Column width={16}>
					{sliderComponent}
				</Grid.Column>
			</Grid.Row>
		</>
	)
}

export default function BettingUi({ province, bets, setBets, setPath }) {
	const { library } = useWeb3React()
	const parties = provinces[province]

	const setPct = (y, pct, setError) => {
		//console.log('Chose game side bets', y, pct, bets)
		if (0 <= pct && pct <= 100) {
			setError(false)

			const newBets = bets
			newBets[y] = pct
			setBets(newBets)
		} else {
			setError(true)
		}
	}

	return (
		<Container style={{textAlign: 'center', marginTop: '6em'}}>
			<Header as='h1' content='Elegí tus apuestas' />
			<Grid divided='vertically'>
				{parties.map((party, y) => (
					<Party key={y} party={party} y={y} pct={bets[y]} setPct={setPct}/>
				))}
			</Grid>
			<Button primary size='huge' onClick={() => setPath(['elecciones', 'submit']) } content='Preparar Apuesta' style={{ marginTop: '2.5em' }}/>
		</Container>
	)
}
