import React, { useState, useEffect } from 'react'
import { Container, Button, Header }  from 'semantic-ui-react'

import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { setPath } from './utils/urls.js'

export default function Landing() {
	return (
		<Container>
			<Header as='h1' content='GaliProde' />
			<Button primary onClick={() => setPath('current')} content='Check out the Current Games!'/>
		</Container>
	)
}
