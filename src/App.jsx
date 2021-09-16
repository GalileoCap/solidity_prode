import React, { useState, useEffect } from 'react'
import { Container, Button, Modal }  from 'semantic-ui-react'

import TopMenu from './menu/topMenu.js'
import BottomMenu from './menu/bottomMenu.js'
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

	if (!active) {
		activate(injectedConnector)
	}

	return (
		<div>
			<TopMenu />
			<Container text style={{ marginTop: '4em' }}>
				{path[1] == 'current' ? <Bettor />
				 : (path[1] == 'create' ? <Creator />
				 : <Landing />)}
		
				<Modal size='tiny' open={!active}>
					<Modal.Header content='Wallet Activation Required' />
					<Modal.Content>
						<p>You need to activate your crypto wallet.</p>
						<p>Right now we're only working with MetaMask, but more are coming!</p>
						<p>If you didn't get a popup <Button secondary onClick={() => activate(injectedConnector)} content='click me'/></p>
					</Modal.Content>
				</Modal>
			</Container>
		</div>
	)
}

export default function App() {
	const getLibrary = (provider) => {
		const library = new Web3Provider(provider)
		library.pollingInterval = 12000
		return library
	}

  return (
		<div style={{textAlign: 'center'}}>
			<Web3ReactProvider getLibrary={getLibrary}>
				<MiddlePerson />
			</Web3ReactProvider>
		</div>
  )
}
