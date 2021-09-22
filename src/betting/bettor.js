import React, { useState, useEffect } from 'react'
import { Container }  from 'semantic-ui-react'
import { Box, Stepper, Step, StepLabel } from '@mui/material'

import { useWeb3React } from '@web3-react/core'

import Betting from './betting.js'
import Submit from './submit.js'
import Receipt from './receipt.js'
import ClaimPrize from './claimPrize.js'

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
	const [fichas, setFichas] = useState(1)

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

	const steps = ['betting', 'submit', 'receipt', 'claimPrize']
	const stepLabels = ['Prepará tus apuestas', 'Confirmalas', 'Recibo', '¡Retirá tus premios!']
	const activeStep = steps.indexOf(path[1])

	return (
		<>
			<Container>
				{activeStep == 0 ?
					<Betting province={province} bets={bets} setBets={setBets} setPath={setPath} />
				: (activeStep == 1 ?
					<Submit province={province} bets={bets} fichas={fichas} setFichas={setFichas} setPath={setPath} />
				: (activeStep == 2 ?
					<Receipt province={province} fichas={fichas} bets={bets} setPath={setPath} />
				: (activeStep == 3 ?
						<ClaimPrize setPath={setPath} />
				: <Container />)))}
			</Container>
			<Box sx={{ width: '100%', marginTop: '3em' }} >
				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((step, x) => (
						<Step key={step}>
							<StepLabel>{stepLabels[x]}</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>
		</>
	)
}
