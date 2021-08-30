/* S: Web3 API **********************************************/

import { InjectedConnector } from '@web3-react/injected-connector'

import { Contract } from "@ethersproject/contracts"
import Web3U from 'web3-utils'

import Wager from '../contracts/Wager.json'

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

export function submitBets(bets, library) {
	const address = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601' //TODO: Get address
	const contract = new Contract(address, Wager.abi, library.getSigner())
	contract.placeBet(bets, { value: Web3U.toWei('1.0', 'ether') })
		.then(x => console.log('submitBets DONE'))
		.catch(err => console.error('submitBets', address, err))
}
