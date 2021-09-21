import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Input, Grid, Modal } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { conseguirVarios } from '../utils/utils.js'
import { submitBets, injectedConnector } from '../utils/web3.js'

import { provinces } from '../data.json'

function Party({ party, pct }) {
	return (
		<>
			<Grid.Row style={{marginTop: '1.5em'}}>
				<Grid.Column computer={3} mobile={7} color='grey'>
					<Header as='h2' content={party} />
				</Grid.Column>
				<Grid.Column computer={5} mobile={9} color='grey'>
					{pct}%
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

function Fichas({ fichas, setFichas }) {
	const masMenos = (lado) => {
		const newFichas = fichas + lado
		if (newFichas > 0) {
			setFichas(newFichas)
		}
	}

	return (
		<Grid.Column>
			<List horizontal>
				<List.Item>
					<Button secondary content='-' onClick={() => masMenos(-1) } />
				</List.Item>
				<List.Item>
					<List.Header content='#Fichas' />
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
			<Button primary onClick={onClickSubmit} content='Apostar' style={{ marginTop: '1em' }}/>
		</Grid.Column>
	)
}

export default function Submit({ province, bets }) {
	const parties = provinces[province]

	const { activate, active, library } = useWeb3React()
	if (!active) {
		activate(injectedConnector)
	}

	const [fichas, setFichas] = useState(1)
	const onClickSubmit = () => {
		console.log('onSubmitBets bets', bets)
		//TODO: Check if valid
		submitBets(bets, library);
	}

	return (
		<Container style={{textAlign: 'center', marginTop: '6em'}}>
			<Header as='h1' content='Confirmá tus apuestas' />
			<Grid stackable>
				<Grid.Row columns={2}>
					<Fichas fichas={fichas} setFichas={setFichas} />
					<ButtonSubmit onClickSubmit={onClickSubmit} />
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
