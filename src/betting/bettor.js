import React, { useState, useEffect } from 'react'
import { Container }  from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'

import Betting from './betting.js'
import Submit from './submit.js'

import { conseguirVarios } from '../utils/utils.js'

import { provinces } from '../data.json'

/* S: API ************************************************************/

function validBets(bets) { //U: Checks if the bettor picked a team on every game
	let res = true
	for (const bet of bets) { res &= 0 <= bet && bet <= 2 }
	return res
}

/* S: Betting UI *****************************************************/
	
export default function Bettor({ path, setPath, province }) {
	const { account, active, library } = useWeb3React()

	const parties = provinces[province]
	const [ bets, setBets ] = useState(Array(parties.length).fill(Math.floor(100 / parties.length)))

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

	//useEffect(() => { updateData() }, [account])
	//if (data.bettor.voted || data.started || data.done) {
		//TODO: send to manage or tell them they're late

	if (path[1] == 'betting') {
		return <Betting province={province} bets={bets} setBets={setBets} setPath={setPath} />
	} else if (path[1] == 'submit') {
		return <Submit province={province} bets={bets} />
	} else {
		<Container />
	}
}
