import React, { useState, useEffect } from 'react'
import { Container, Button, Modal }  from 'semantic-ui-react'

import Banner from './menu/banner.js'
import Landing from './landing/landing.js'
import Betting from './betting/betting.js'
//import Creator from './creator/creator.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { submitBets, injectedConnector } from './utils/web3.js'
import { parseUrl } from './utils/urls.js'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
	const { activate, active } = useWeb3React()
	const [path, setPath] = useState([''])
	const needToActivate = (path[0] == 'elecciones' || path[0] == 'create') && !active

	if (needToActivate) {
		activate(injectedConnector)
	}

	return (
		<>
			<Banner setPath={setPath} />
			<Container fluid>
				{ path[0] == 'elecciones' ? <Betting /> :
				 <Landing setPath={setPath} /> }
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
