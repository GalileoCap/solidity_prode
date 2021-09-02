import React, { useState, useEffect } from 'react'
import { Container, Button, Header } from 'semantic-ui-react'

import { claimPrize } from '../utils/web3.js'

/* S: Managing UI ****************************************************/

export default function Manage({ bettor, started, done, library, forceUpdate }) {
	const claimButton = () => {
		const text = 'Claim Prize'	

		if (!done || bettor.extracted) {
			return <Button secondary disabled content={text} />
		} else {
			return <Button primary onClick={() => claimPrize(library)}content={text} />
		}
	}

	//TODO: Per-game info

	return (
		<Container>
			<Container>
				<Header as='h1'>Info</Header>
				{claimButton()}
			</Container>
		</Container>
	)
	//TODO: <Button secondary content='Update' style={{ marginTop: '1em' }}/>
}
