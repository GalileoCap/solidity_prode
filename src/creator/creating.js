import React, { useState } from 'react'
import { Input, List, Container, Button, Header, Flag, Confirm } from 'semantic-ui-react'

import { useWeb3React } from '@web3-react/core'
import Web3U from 'web3-utils'

import { createContract } from '../utils/web3.js'

import { games } from '../data.json'

/* S: API ************************************************************/

/* S: Creating UI ****************************************************/

export default function Creating({ setAddress }) {
	const { chainId, account, activate, active, library } = useWeb3React()
	const [price, setPrice] = useState('0.0026') //A: Dflt ~1USD

	const onChangePrice = (e) => {
		const newPrice = parseFloat(e.target.value)
		setPrice(newPrice)
		console.log('onChangePrice', newPrice)
	}

	const [popUp, setPopUp] = useState(false)
	const onClickConfirm = async () => {
		const contract = await createContract(price, library)
		await contract.deployTransaction.wait()

		setAddress(contract.address)
		console.log('onClickConfirm address', contract.address)
	}

	const onClickCancel = () => {
		console.log('onClickCancel TODO')
		setPopUp(false)
	}

	return (
		<Container>
			<Header as='h1'>Confirm info</Header>
			<List>
				<List.Item>
					<List.Header content='Games' />
					<List>
						{ games.map((game, y) => (
							<List.Item key={y}>
								{game.local} vs. {game.away}
							</List.Item>
						))}
					</List>
				</List.Item>

				<List.Item>
					<List.Header content='#Games' />
					{games.length}	
				</List.Item>

				<List.Item>
					<List.Header content='Price (ETH)' />
					<Input icon='ethereum' placeholder={price} onChange={onChangePrice} />
				</List.Item>
			</List>

			<Button primary onClick={() => setPopUp(true)} content='Submit' />

			<Confirm open={popUp} onConfirm={onClickConfirm} onCancel={onClickCancel}
				header='Are you sure?' content={(
					<Container className='content'>
					<List>
						<List.Item>
							<List.Header content='#Games'/>
							{games.length}
						</List.Item>
						<List.Item>
							<List.Header content='Price'/>
							{price}
						</List.Item>
					</List>
				</Container>
			)} />
		</Container>
	)
}
