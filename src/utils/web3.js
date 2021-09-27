/* S: Web3 API **********************************************/

import { InjectedConnector } from '@web3-react/injected-connector'

import { Contract, ContractFactory } from "@ethersproject/contracts"
import Web3U from 'web3-utils'

import Wager from '../contracts/Wager.json'
import { address as Address, provinces } from '../data.json'

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

export function submitBets(bets, library, callback = () => {}, address = Address) {
	const contract = getContract(library)
	getFromContract(['price'], library, address).then(price => {
		contract.placeBet(bets, { value: price })
			.then(callback)
			.catch(err => console.error('submitBets placeBet', address, err))
	})
		.catch(err => console.error('submitBets getPrice', address, err))
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

export async function createContract(province, price, library) {
	const factory = new ContractFactory(Wager.abi, Wager.bytecode, library.getSigner())
	return await factory.deploy(provinces[province].length, Web3U.toWei(String(price), 'ether'))
}

window.submitBets = submitBets
window.createContract = createContract

export function startGames(library, address = Address) {
	const contract = getContract(library, address)
	contract.startGames()
}
