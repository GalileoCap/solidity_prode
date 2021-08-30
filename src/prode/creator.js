import React, { useState, useEffect } from 'react'
import { Button, Input } from 'semantic-ui-react'

import { Contract, ContractFactory } from "@ethersproject/contracts";

import ContractInfo from './contract_info.js'
import Wager from '../contracts/Wager.json'

/* S: Bet setup & management UI *****************************/

export default function Creator({ account, library }) { //U: UI to setup bets
	const [contract, setContract] = useState(undefined)
	const [address, setAddress] = useState('')

	const inputAddress = (e) => {
		setAddress(e.target.value)
	}

	const inputContract = () => {
		//TODO: Check if address is valid
		const newContract = new Contract(address, Wager.abi, library.getSigner())
		setContract(newContract)
	}

	const onClickCreate = async () => {
		const factory = new ContractFactory(Wager.abi, Wager.bytecode, library.getSigner())
		const contract = await factory.deploy()

		contract.deployTransaction.wait().then( //A: Wait until it's been deployed
			() => setContract(contract)
		)
	}

	const onClickStartGames = async () => {
		await contract.startGames()
	}

	const onClickInputResults = () => {
		//TODO: Board to input the results
	}

	//TODO: Disable buttons if the contract is already marked as started/done/etc
	
	return (
		<div>
			<h1>Creator</h1>
			{contract ? (
					<div>
						<ContractInfo account={account} contract={contract} />
						<div>
							<Button onClick={onClickStartGames} content='Start Games' />
							<br/><Button onClick={onClickInputResults} content='Input Results' />
						</div>
					</div>
				) :	(
				<div>
					<div>
						Input contract address:
						<br/><Input value={address} onChange={inputAddress} />
						<br/><Button primary onClick={inputContract} content='Send' />
					</div>
					<div>
						Create new contract
						<br/><Button primary onClick={onClickCreate} content='Create' />
					</div>
				</div>
			)}
		</div>
	)
}
