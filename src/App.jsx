import React, { useState, useEffect } from 'react'
import { Container, Button, Modal }  from 'semantic-ui-react'

import Banner from './menu/banner.js'
import Landing from './landing/landing.js'
import Bettor from './betting/bettor.js'
//import Creator from './creator/creator.js'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { submitBets, injectedConnector } from './utils/web3.js'
import { parseUrl } from './utils/urls.js'

/* S: UI Manager ********************************************/

function MiddlePerson() { //U: Needed for activate to work
	const [path, setPath] = useState([''])

	return (
		<>
			<Banner setPath={setPath} />
			<Container fluid>
				{ path[0] == 'elecciones' ? <Bettor path={path} setPath={setPath} province='Buenos Aires' /> :
				 <Landing setPath={setPath} /> }
			</Container>
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
