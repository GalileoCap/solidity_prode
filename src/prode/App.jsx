import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'

import Bettor from './bettor.js'
import Creator from './creator.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from './web3.js'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
  const { chainId, account, activate, active, library } = useWeb3React()
	const [mode, setMode] = useState('bettor')

  const onClickActivate = () => {
    activate(injectedConnector)
	}

	const changeMode = () => {
		setMode(mode == 'creator' ? 'bettor' : 'creator')
	}

	if (active) { //A: Let them bet
		return (
			<div>
				{mode == 'creator' ? (
					<div>
						<Creator account={account} library={library} />
					</div>
				) : (
					<div>
						<Bettor account={account} library={library} />
					</div>
				)}
				<br />
				<div>
					<div>Account: {account}</div>
					<div>
						<Button onClick={changeMode} content='Change Role' />
					</div>
				</div>
			</div>
		)
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
