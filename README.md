# Prode

## TODO

* Pantalla para **crear** un contrato
* Pantalla para apostar
	* Grilla
	![ejemplo_grilla](./doc/ejemplo_grilla.jpg)
	* 
* Traer y hacer andar los contratos

## Bitacora
* web3-react necesita tener esto instalado

~~~
sudo npm i -g node-gyp
sudo apt-get install libusb-1.0-0-dev
~~~

* Y para usar Web3 con React se necesita agregar esto al index.html

~~~
<script>window.global = {}</script>
~~~

## Desplegando contrato

Corrés en la consola:
~~~
await web3React.activate()
contract = await createContract('Buenos Aires', 0.5, web3React.library)
~~~

Cambiás en src/data.json el address a `contract.address`
