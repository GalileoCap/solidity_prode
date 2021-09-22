import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Input, Grid, Modal } from 'semantic-ui-react'
import { Slider } from '@mui/material'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { conseguirVarios } from '../utils/utils.js'
import { submitBets, injectedConnector } from '../utils/web3.js'

import { provinces } from '../data.json'

function Party({ party, pct }) {
	const sliderComponent = <Slider value={pct} disabled />

	return (
		<>
			<Grid.Row style={{marginTop: '1.5em'}}>
				<Grid.Column computer={3} mobile={7} color='grey'>
					<Header as='h2' content={party} />
				</Grid.Column>
				<Grid.Column computer={5} mobile={9} color='grey'>
					<Header inverted as='h3'>{pct}%</Header>
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

function ReceiptInfo({ fichas }) {
	return (
		<Grid.Column>
			<Header as='h3'>
				Se guardaró tu apuesta por {fichas} fichas
			</Header>
		</Grid.Column>
	)
}

function ButtonContinue({ setPath }) {
	return (
		<Grid.Column>
			<Button primary onClick={() => setPath([''])} content='Seguir Apostando' style={{ marginTop: '1em' }}/>
		</Grid.Column>
	)
}

export default function Receipt({ province, bets, fichas, setPath }) {
	const parties = provinces[province]

	return (
		<Container style={{textAlign: 'center', marginTop: '6em'}}>
			<Header as='h1' content='¡Mucha suerte!' />
			<Grid stackable>
				<Grid.Row columns={2}>
					<ReceiptInfo fichas={fichas} />
					<ButtonContinue setPath={setPath}/>
				</Grid.Row>
			</Grid>

			<Grid divided='vertically'>
				{parties.map((party, y) => (
					<Party key={y} party={party} pct={bets[y]} />
				))}
			</Grid>
		</Container>
	)
}
