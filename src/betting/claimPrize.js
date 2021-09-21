import React, { useState, useEffect } from 'react'
import { List, Container, Button, Header, Input, Grid, Modal } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { conseguirVarios } from '../utils/utils.js'
import { claimPrize, injectedConnector } from '../utils/web3.js'

import { provinces } from '../data.json'

export default function ClaimPrize({ setPath }) {
	const { account, activate, active, library } = useWeb3React()
	if (!active) {
		activate(injectedConnector)
	}

	const onClickSubmit = () => {
		console.log('onClaimPrize bets', bets)
		claimPrize(library, () => setPath(['elecciones', 'prizeReceipt']));
	}

	//TODO: Get how much money they won

	return (
		<Container style={{textAlign: 'center', marginTop: '6em'}}>
			<Header as='h1' content='Retirar Premios' />
			<List>
				<List.Item>
					<Header as='h2' content='Ganaste' />
					<Header style={{fontFamily: 'Anton', fontSize: '2.5em'}} content='$X' />
					<Header as='h2' content='en premios' />
				</List.Item>
				<List.Item>
					<Header as='h3'>
						<p>lo enviaremos a</p>
						{account}
					</Header>
				</List.Item>
				<List.Item>
					<Button primary content='Retirar' />
				</List.Item>
			</List>

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
