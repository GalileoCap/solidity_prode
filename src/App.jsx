import React, { useState, useEffect } from 'react'
import { Container, Button, Modal }  from 'semantic-ui-react'

import Banner from './banner.js'
import Landing from './landing.js'
import Bettor from './bettor/bettor.js'
import Creator from './creator/creator.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { submitBets, injectedConnector } from './utils/web3.js'
import { parseUrl } from './utils/urls.js'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
	const { chainId, account, activate, active, library } = useWeb3React()
	const { path } = parseUrl(window.location)
	const needToActivate = (path[1] == 'current' || path[1] == 'create') && !active

	if (needToActivate) {
		activate(injectedConnector)
	}

	return (
		<>
			<Banner />
			<Container fluid>
				 <Landing />
			</Container>
			<Modal size='tiny' open={needToActivate}>
				<Modal.Header content='Wallet Activation Required' />
				<Modal.Content>
					<p>You need to activate your crypto wallet.</p>
					<p>Right now we're only working with MetaMask, but more are coming!</p>
					<p>If you didn't get a popup <Button secondary onClick={() => activate(injectedConnector)} content='click me'/></p>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default function App() {
	const getLibrary = (provider) => {
		const library = new Web3Provider(provider)
		library.pollingInterval = 12000
		return library
	}

  return (
		<>
			<Web3ReactProvider getLibrary={getLibrary}>
				<MiddlePerson />
			</Web3ReactProvider>
		</>
  )
}
