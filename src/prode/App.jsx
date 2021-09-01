import React, { useState, useEffect } from 'react'
import { Button }  from 'semantic-ui-react'

import Bettor from './bettor.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { submitBets, injectedConnector } from './web3.js'
import { games } from './data.json'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
  const { chainId, account, activate, active, library } = useWeb3React()

  const onClickActivate = () => {
    activate(injectedConnector)
	}

	if (active) { //A: Let them bet
		return <Bettor games={games} submitBets={submitBets} library={library}/>
	} else { //A: Ask them to log in
		return (
			<div>
				<h1>Wallet activation required</h1>
				<Button primary onClick={onClickActivate} content='Activate' />
			</div>
		)
	}
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
