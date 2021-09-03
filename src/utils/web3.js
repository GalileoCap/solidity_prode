/* S: Web3 API **********************************************/

import { InjectedConnector } from '@web3-react/injected-connector'

import { Contract, ContractFactory } from "@ethersproject/contracts"
import Web3U from 'web3-utils'

window.Web3U = Web3U

import Wager from '../contracts/Wager.json'
import { address as Address, games } from '../data.json'

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
		97, //A: BTC Testnet
		1337, //A: Local
  ],
})

function getContract(library, address = Address) {
	return new Contract(address, Wager.abi, library.getSigner())
}

export function submitBets(bets, library, address = Address) {
	const contract = getContract(library)
	contract.placeBet(bets, { value: Web3U.toWei('1.0', 'ether') })
		.then(x => console.log('submitBets DONE'))
		.catch(err => console.error('submitBets', address, err))
}

export function claimPrize(library, address = Address) {
	const contract = getContract(library)
	contract.claimPrize()
		.then(x => console.log('claimPrize DONE'))
		.catch(err => console.error('claimPrize', address, err))
}

export function getFromContract(args, library, address = Address) {
	const contract = getContract(library, address)

	if (args[0] == 'bettor') { return contract.getBettor() }
	else if (args[0] == 'started') { return contract.Started() }
	else if (args[0] == 'done') { return contract.Done() }
	else if (args[0] == 'game') { return contract.getGame(args[1]) }
	else if (args[0] == 'price') { return contract.MinPrice() }
	else if (args[0] == 'totalPool') { return contract.TotalPool() }
	else { console.error('getFromContract invalid arguments', args) }
}

export async function createContract(price, library) {
	const factory = new ContractFactory(Wager.abi, Wager.bytecode, library.getSigner())
	//const contract = await factory.deploy(games.length, price)
	return await factory.deploy(games.length, Web3U.toWei(String(price), 'ether'))
}
