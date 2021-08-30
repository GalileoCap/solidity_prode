import React, { useState, useEffect } from 'react'
import { Button }  from 'semantic-ui-react'

import Bettor from './bettor.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from './web3.js'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
  const { chainId, account, activate, active, library } = useWeb3React()

  const onClickActivate = () => {
    activate(injectedConnector)
	}

	const games = [ //U: List of games with their info //TODO: Get it from the contract
		{local: 'Boca', away: 'River', date: new Date(2021, 8, 30)},
		{local: 'San Lorenzo', away: 'Ferro', date: new Date(2021, 8, 31)},
	]	
	const submitBets = (bets) => {
		//TODO: Sign contract and change screen
	}

	if (active) { //A: Let them bet
		return <Bettor games={games} submitBets={submitBets}/>
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
