//FROM: https://ethereum.org/en/developers/tutorials/set-up-web3js-to-use-ethereum-in-javascript/
web3 = new Web3(Web3.givenProvider || "ws://localhost:8545"); //VER: https://web3js.readthedocs.io/en/v1.3.4/getting-started.html#adding-web3-js
//web3 = new Web3("http://localhost:8545") 
//web3= new Web3("https://cloudflare-eth.com") //U: gratis de cloudflare

/* se puede buscar ej. la wallet Metamask instalada en el browser asi
if (window.ethereum != null) {
	web3 = new Web3(window.ethereum)
	try {
		// Request account access if needed
		await window.ethereum.enable()
		// Acccounts now exposed

	} catch (error) {
		// User denied account access...
	}
}
*/

web3.eth.getBlockNumber(function (error, result) {
	console.log(result)
})
