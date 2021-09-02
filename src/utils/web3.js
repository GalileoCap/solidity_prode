/* S: Web3 API **********************************************/

import { InjectedConnector } from '@web3-react/injected-connector'

import { Contract, ContractFactory } from "@ethersproject/contracts"
import Web3U from 'web3-utils'

import Wager from '../contracts/Wager.json'
import { address } from '../data.json'

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
		1337, //A: Local
  ],
})

function getContract(library) {
	return new Contract(address, Wager.abi, library.getSigner())
}

export function submitBets(bets, library) {
	const contract = getContract(library)
	contract.placeBet(bets, { value: Web3U.toWei('1.0', 'ether') })
		.then(x => console.log('submitBets DONE'))
		.catch(err => console.error('submitBets', address, err))
}

export function claimPrize(library) {
	const contract = getContract(library)
	contract.claimPrize()
		.then(x => console.log('claimPrize DONE'))
		.catch(err => console.error('claimPrize', address, err))
}

export function getFromContract(args, library) {
	const contract = getContract(library)

	if (args[0] == 'bettor') { return contract.getBettor() }
	else if (args[0] == 'started') { return contract.Started() }
	else if (args[0] == 'done') { return contract.Done() }
	else if (args[0] == 'game') { return contract.Games(args[1]) }
	else { console.error('getFromContract invalid arguments', args) }
}
