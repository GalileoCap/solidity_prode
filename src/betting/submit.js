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

function Fichas({ fichas, setFichas, only }) {
	const masMenos = (lado) => {
		const newFichas = fichas + lado
		if (newFichas > 0) {
			setFichas(newFichas)
		}
	}

	return (
		<Grid.Column only={only}>
			<List horizontal>
				<List.Item>
					<Button secondary content='-' onClick={() => masMenos(-1) } />
				</List.Item>
				<List.Item>
					<List.Header as='h2' content='#Fichas' />
					<List.Description content={fichas} />
				</List.Item>
				<List.Item>
					<Button secondary content='+' onClick={() => masMenos(1) } />
				</List.Item>
			</List>
		</Grid.Column>
	)
}

function ButtonSubmit({ onClickSubmit }) {
	return (
		<Grid.Column>
			<Button primary size='huge' onClick={onClickSubmit} content='Confirmar Apuesta' style={{ marginTop: '1em' }}/>
		</Grid.Column>
	)
}

export default function Submit({ province, bets, fichas, setFichas, setPath }) {
	const parties = provinces[province]

	const { activate, active, library } = useWeb3React()
	if (!active) {
		activate(injectedConnector)
	}

	const onClickSubmit = () => {
		console.log('onSubmitBets bets', bets)
		//TODO: Check if valid
		submitBets(bets, library, () => setPath(['elecciones', 'receipt']));
	}

	return (
		<Container style={{textAlign: 'center', marginTop: '6em'}}>
			<Header as='h1' content='Confirmá tus apuestas' />
			<Grid stackable>
				<Grid.Row columns={2}>
					<Fichas fichas={fichas} setFichas={setFichas} only='computer tablet' />
					<ButtonSubmit onClickSubmit={onClickSubmit} />
					<Fichas fichas={fichas} setFichas={setFichas} only='mobile' />
				</Grid.Row>
			</Grid>

			<Grid divided='vertically'>
				{parties.map((party, y) => (
					<Party key={y} party={party} pct={bets[y]} />
				))}
			</Grid>

			<Modal size='tiny' open={!active}>
				<Modal.Header content='Active la Crypto-Billetera' />
				<Modal.Content>
					<p>Necesita activar la Crypto-Billetera para apostar</p>
					<p>Por ahora solo usamos MetaMask, ¡pero hay más en camino!</p>
					<p>Si no te salió otro popup <Button secondary onClick={() => activate(injectedConnector)} content='¡Clickeame!'/></p>
				</Modal.Content>
			</Modal>

		</Container>
	)
}
