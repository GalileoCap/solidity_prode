import React, { useState, useEffect } from 'react'
import { Container, Button }  from 'semantic-ui-react'

import TopMenu from './menu/topMenu.js'
import BottomMenu from './menu/bottomMenu.js'
import Bettor from './bettor/bettor.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { submitBets, injectedConnector } from './utils/web3.js'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
	const { chainId, account, activate, active, library } = useWeb3React()

  const onClickActivate = () => {
    activate(injectedConnector)
	}

	return (
		<div>
			<TopMenu />
			<Container text style={{ marginTop: '4em' }}>
				{active ? 
					<Bettor submitBets={submitBets} />
				: (
					<div>
						<h1>Wallet activation required</h1>
						<Button primary onClick={onClickActivate} content='Activate' />
					</div>
				)}
			</Container>
			<BottomMenu />
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
