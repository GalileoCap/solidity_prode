import React, { useState, useEffect } from 'react'
import { Container, Header, Input, Button }  from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'

import { conseguirVarios } from '../utils/utils.js'
import { getFromContract } from '../utils/web3.js'

import Creating from './creating.js'
import Managing from './managing.js'

export default function Creator() {
	const [address, setAddress] = useState(undefined)
	const [tmpAddress, setTmpAddress] = useState(undefined)
	const [mode, setMode] = useState(0)

	const onClickInput = () => {
		//TODO: Check if address is valid
		setAddress(tmpAddress)
		console.log('onClickInput newAddress', tmpAddress)
	}

	const onChangeInput = (e) => {
		const newTmpAddress = e.target.value
		setTmpAddress(newTmpAddress)
		console.log('onChangeInput newTmpAddress', newTmpAddress)
	}

	if (address) {
		return <Managing address={address} />
	} else if (mode == 2) {
		return (
			<Container>
				<Input placeholder='0x' action={{onClick: onClickInput, content: 'Send'}} onChange={onChangeInput}/>
			</Container>
		)
	} else if (mode == 1) {
		return <Creating setAddress={setAddress} />
	} else if (mode == 0) {
		return (
			<Container>
				<Button primary onClick={() => setMode(1)} content='Create' />
				<Button secondary onClick={() => setMode(2)} content='Manage' />
			</Container>
		)
	}
}
