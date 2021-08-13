import React, { useState } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3U from 'web3-utils'

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

function getLibrary(provider){
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

export const Wallet = () => {
  const { chainId, account, activate, active, library } = useWeb3React()
	const [ balance, setBalance ] = useState()

	window.web3 = useWeb3React()
	window.web3u = Web3U

  const onClick = () => {
    activate(injectedConnector)
  }

	const checkBalance = () => {
		const provider = new Web3Provider(library.provider)
		provider.getBalance(account).then(x => setBalance(Web3U.fromWei(x.toString(), 'ether')))
		console.log('checkBalance')
	}

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
			<div>Balance: {balance}</div>
      {active ? (
				<div>
					<div>Activo </div>
					<button onClick={checkBalance}>Check Balance</button>
				</div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  )
}

export const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Wallet />
    </Web3ReactProvider>
  )
}

export default App
