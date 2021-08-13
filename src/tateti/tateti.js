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
