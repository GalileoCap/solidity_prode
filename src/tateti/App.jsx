import React, { useState, useEffect } from 'react';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'

//S: Web3 TODO: Mover

function probarWeb3() {

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
}

//S: API TaTeTi TODO: Sacar esta seccion de la UI

const TransicionTateti = {
	'-': 'X',
	'X': 'O',
	'O': '-'
};

function TatetiActualizarTablero(tablero, fila, col, quePidio) {
	let tableroNuevo = tablero.concat()
	tableroNuevo[fila * 3 + col] = quePidio;
	console.log('TatetiActualizarTablero', tablero, tableroNuevo, fila, col, quePidio);
	return tableroNuevo
}

function cargarReglas() {
	return JSON.parse(localStorage.getItem('reglas'))
}

function guardarReglas(reglas) {
	localStorage.setItem('reglas', JSON.stringify(reglas))
}

function guardarRegla(tableroAntes, tableroDespues) {
	const reglas = cargarReglas()
	const reglasNuevas = {...reglas, [tableroAntes.join('')]: tableroDespues.join('')}
	guardarReglas(reglasNuevas)
	console.log('Guardar Regla', tableroAntes, tableroDespues, reglasNuevas)
	return reglasNuevas
}

function buscarRegla(tableroAntes) {
	const reglas = cargarReglas()
	console.log('Buscar Regla', tableroAntes, reglas)
	const tableroDespues = reglas[tableroAntes.join('')].split('') || tableroAntes
	return tableroDespues
}

function quienGano(tablero) { //U: Determina quien gano, asume tablero valido
	let ganoX = false
	let ganoO = false

	for (let i = 0; i < 3; i++) {
		let porFilas = tablero[i * 3] == tablero[i * 3 + 1] && tablero[i * 3] == tablero[i * 3 + 2] //A: Las tres de esta fila iguales
		let porColumnas = tablero[i] == tablero[3 + i] && tablero[i] == tablero[6 + i] //A: Las tres de esta columna iguales

		ganoX = ganoX || (tablero[i * 3] == 'X' && porFilas) || (tablero[i] == 'X' && porColumnas)
		ganoO = ganoO || (tablero[i * 3] == 'O' && porFilas) || (tablero[i] == 'O' && porColumnas)
	}

	if (ganoX) { return 'X' }
	else if (ganoO) { return 'O' }
	else { return false }
}

function quienJuega(tablero) { //U: Determina a quien le toca, o si el tablero es invalido
	const count = {'X': 0, '-': 0, 'O': 0} //A: Cuantos de cada
	for (let x of tablero) { count[x]++ }

	//A: Asumiendo que arranca X
	if (count['X'] == count['O']) { //A: Le toca a X
		return 'X'
	} else if (count['X'] == (count['O'] + 1)) { //A: Le toca a O
		return 'O'
	} else { //A: Es invalido
		return false
	}
}

function analizarTablero(tablero) { //U: Determina quien gano, a quien le toca, y si el tablero es valido
	let gano = quienGano(tablero)
	let turnoDe = quienJuega(tablero)
	let valido = Boolean(turnoDe)

	return {gano, turnoDe, valido}
}

//S: UI TaTeTi

function Casillero({ estado, onClick }) {
	return (
		<div onClick={onClick} style={{display: 'inline-block', width: '1.5em'}}>
			{estado}
		</div>
	);
}

function Tablero({ tablero, onClickCasillero}) {
	const tableroAComponente = () => {
		console.log('tableroAComponente', tablero);
		const filas = []; //A: filas es siempre el mismo array, pero el contenido puede cambiar

		for (let fila = 0; fila < 3; fila++) {
			filas.push([]);
			for (let col = 0; col < 3; col++) {
				let estadoCasillero = tablero[fila * 3 + col];
				filas[fila].push(
					<Casillero
						key={fila * 3 + col}
						estado={estadoCasillero}
						onClick={() => onClickCasillero(fila, col, estadoCasillero)}
					/>
				);
			}
		}

		return filas.map((estaFila, i) => (<div key={i}> {estaFila} </div>))
	}

	return (
		<div>
			{tableroAComponente()}
		</div>
	);
}

function Tateti() {
	const tablero = '--X-O----'.split('')
	const [tableroAntes, setTableroAntes] = useState(tablero);
	const [tableroDespues, setTableroDespues] = useState(tablero);

	const onClickCasilleroAntes = (fila, col, estadoCasillero) => {
		console.log('onClickCasilleroAntes', fila, col, estadoCasillero);
		setTableroAntes(
			TatetiActualizarTablero(tableroAntes, fila, col, TransicionTateti[estadoCasillero])
		)
	}

	const onClickCasilleroDespues = (fila, col, estadoCasillero) => {
		console.log('onClickCasilleroDespues', fila, col, estadoCasillero);
		setTableroDespues(
			TatetiActualizarTablero(tableroDespues, fila, col, TransicionTateti[estadoCasillero])
		)
	}

	const miGuardarRegla = () => {
		guardarRegla(tableroAntes, tableroDespues)
	}

	const miBuscarRegla = () => {
		setTableroDespues(buscarRegla(tableroAntes))
	}

	const miAnalizarTablero = () => {
		console.log(analizarTablero(tableroAntes))
	}

	return (
		<div>
			<h1>Tateti</h1>
			<div style={{display:"inline-block", border:"1px dotted gray", margin:"5px"}}>
				<Tablero tablero={tableroAntes} onClickCasillero={onClickCasilleroAntes}/>
			</div>
			<div style={{display:"inline-block", border:"1px dotted gray", margin:"5px"}}>
				<Tablero tablero={tableroDespues} onClickCasillero={onClickCasilleroDespues}/>
			</div>
			<div>
				<button onClick={miGuardarRegla}>Guardar Regla</button>
				<button onClick={miBuscarRegla}>Buscar Regla</button>
				<button onClick={miAnalizarTablero}>Analizar Tablero</button>
			</div>
		</div>
	);
}

export default function App() {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <>
      <Header />
      <hr style={{ margin: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {Object.keys(connectorsByName).map(name => {
          const currentConnector = connectorsByName[name]
          const activating = currentConnector === activatingConnector
          const connected = currentConnector === connector
          const disabled = !triedEager || !!activatingConnector || connected || !!error

          return (
            <button
              style={{
                height: '3rem',
                borderRadius: '1rem',
                borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative'
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector)
                activate(connectorsByName[name])
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {(active || error) && (
          <button
            style={{
              height: '3rem',
              marginTop: '2rem',
              borderRadius: '1rem',
              borderColor: 'red',
              cursor: 'pointer'
            }}
            onClick={() => {
              deactivate()
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
      </div>

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then((signature) => {
                  window.alert(`Success!\n\n${signature}`)
                })
                .catch((error) => {
                  window.alert('Failure!' + (error && error.message ? `\n\n${error.message}` : ''))
                })
            }}
          >
            Sign Message
          </button>
        )}
        {!!(connector === connectorsByName[ConnectorNames.Network] && chainId) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector).changeChainId(chainId === 1 ? 4 : 1)
            }}
          >
            Switch Networks
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.WalletConnect] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector).close()
            }}
          >
            Kill WalletConnect Session
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.WalletLink] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector).close()
            }}
          >
            Kill WalletLink Session
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.Fortmatic] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector).close()
            }}
          >
            Kill Fortmatic Session
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.Magic] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector ).close()
            }}
          >
            Kill Magic Session
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.Portis] && (
          <>
            {chainId !== undefined && (
              <button
                style={{
                  height: '3rem',
                  borderRadius: '1rem',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  ;(connector).changeNetwork(chainId === 1 ? 100 : 1)
                }}
              >
                Switch Networks
              </button>
            )}
            <button
              style={{
                height: '3rem',
                borderRadius: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => {
                ;(connector).close()
              }}
            >
              Kill Portis Session
            </button>
          </>
        )}
        {connector === connectorsByName[ConnectorNames.Torus] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector).close()
            }}
          >
            Kill Torus Session
          </button>
        )}
      </div>
    </>
  )
}

