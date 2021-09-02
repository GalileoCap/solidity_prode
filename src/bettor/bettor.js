import React, { useState, useEffect } from 'react'
import { Container }  from 'semantic-ui-react'

import { conseguirVarios } from '../utils/utils.js'
import { getBettor, getStarted, getDone } from '../utils/web3.js'

import Betting from './betting.js'
import Managing from './managing.js'

export default function Bettor({ submitBets, library }) {
	const [data, setData] = useState({bettor: undefined, started: false, done:false})

	const updateData = async () => {
		const comoConseguir = {
			bettor: async () => ( await getBettor(library) ),
			started: async () => ( await getStarted(library) ),
			done: async () => ( await getDone(library) )
		}

		const newData = await conseguirVarios(comoConseguir, 'bettor updateData')
		setData(newData)
		console.log('bettor updateData done', newData)
	}

	useEffect(() => { updateData() }, [submitBets, library])

	if (data.bettor == undefined) {
		return <Container />
	} else if (!data.bettor.voted && !data.started && !data.done) {
		return <Betting submitBets={submitBets} library={library} />
	} else {
		return <Managing bettor={data.bettor} library={library} />
	}
}
