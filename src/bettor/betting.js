import React, { useState, useEffect } from 'react'
import { Menu, Icon, List, Container, Button, Header, Segment, Confirm, Sidebar } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { useForceUpdate, conseguirVarios } from '../utils/utils.js'
import { submitBets, getFromContract } from '../utils/web3.js'

import Map from '../map/map.js'
import { provinces } from '../data.json'

/* S: Betting UI *****************************************************/

function BetsList({ bets }) {
	return (
		<div className="content">
			<List>
				{games.map((game, y) => (
					<List.Item key={y}>
						<List.Header>{game.local} vs. {game.away}</List.Header>
						<List.Description>
							{bets[y] == 0 ? game.local : (bets[y] == 1 ? game.away : 'Tie')}
						</List.Description>
					</List.Item>
				))}
			</List>
		</div>
	)
}

function Side({ id, chosenSide, onChooseSide }) {
	const data = provinces[id - 1]

	const getButtonColor = (side) => {
		return chosenSide ? (chosenSide == side ? 'green' : 'red') : 'grey'
	}

	if (!id) {
		return <Header as='h2' inverted style={{margin: '0.3em'}} content='Clickeá en una provincia' />
	} else {
		return (
			<>
				<Header as='h2' inverted style={{margin: '0.3em'}} content={data.name} />
				{data.sides.map(side => (
					<Button
						key={side}
						onClick={() => {onChooseSide(id, side)} }
						color={getButtonColor(side)}
						style={{marginTop: '0.5em'}}
						content={side} />
				))}
			</>
		)
	}
}

export default function Betting() {
	const { chainId, account, activate, active, library } = useWeb3React()
	const [ bets, setBets ] = useState(Array(provinces.length).fill(undefined))
	const forceUpdate = useForceUpdate() 
	
	const [ province, setProvince ] = useState(undefined)

	const onClickProvince = (gprops) => {
		const { ID_1: id, NAME_1: name } = gprops
		console.log('onClickProvince id name', id, name)
		setProvince(id)
	}

	const onChooseSide = (id, side) => {
		console.log('onChooseSide', id, side, bets)
		const newBets = bets
		newBets[id - 1] = side
		setBets(newBets)
		forceUpdate()
	}

	const [ popup, setPopup ] = useState(false)

	const onClickSubmit = () => {
		console.log('onSubmitBets bets', bets)
		if (validBets(bets)) {
			console.log('onSubmitBets valid bets')
			setPopup(true)
		} else {
			console.log('onSubmitBets invalid bets')
			//TODO: Tell the bettor
		}
	}

	const onClickCancel = () => {
		console.log('onClickCancel')
		setPopup(false)
	}

	return (
		<Container>
			<Sidebar.Pushable>
				<Sidebar
					as={Menu}
					animation='overlay'
					icon='labeled'
					inverted
					visible
					vertical
					width='thin'
				>
					<Side id={province} chosenSide={bets[province - 1]} onChooseSide={onChooseSide} />
				</Sidebar>

				<Sidebar.Pusher>
					<Segment basic>
						<Map onClickProvince={onClickProvince} bets={bets} />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>

			<Button primary onClick={onClickSubmit} content='Submit' style={{ marginTop: '1.5em' }}/>
			<Confirm open={popup} onConfirm={() => submitBets(bets, library)} onCancel={onClickCancel}
				header="Are you sure?"
				content={<BetsList bets={bets} />}
			/>	
		</Container>
	)
}
