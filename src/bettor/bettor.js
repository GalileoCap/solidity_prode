import React, { useState, useEffect } from 'react'
import { Container }  from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'

import { conseguirVarios } from '../utils/utils.js'
import { getFromContract } from '../utils/web3.js'

import Betting from './betting.js'
import Managing from './managing.js'

export default function Bettor() {
	const { account, active, library } = useWeb3React()

	const [data, setData] = useState({bettor: undefined, started: false, done:false})

	const updateData = async () => {
		const comoConseguir = {
			bettor: async () => ( await getFromContract(['bettor'], library) ),
			started: async () => ( await getFromContract(['started'], library) ),
			done: async () => ( await getFromContract(['done'], library) )
		}

		if (active) { //A: The first time that it loads, account is undefined before activating
			const newData = await conseguirVarios(comoConseguir, 'bettor updateData')
			setData(newData)
			console.log('bettor updateData done', newData)
		} else {
			console.error('bettor not active')
		}
	}

	useEffect(() => { updateData() }, [account])

	if (data.bettor == undefined) {
		return <Container />
	} else if (!data.bettor.voted && !data.started && !data.done) {
		return <Betting />
	} else {
		return <Managing bettor={data.bettor} />
	}
}
