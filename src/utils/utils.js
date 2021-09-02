import { useState } from 'react'

/* S: Utils *************************************************/

export async function conseguirVarios(comoConseguir, cartelParaLog = '') { //U: Recibe un diccionario de las claves y la funcion que consigue su valor. Y espera a que se cumplan todas las promesas
	const valores = {}
	const promesas = Object.entries(comoConseguir).map(async ([key, func]) => {
		valores[key] = 'buscando'
		try {
			valores[key] = await func()
		} catch (err) {
			console.error(cartelParaLog + ' conseguirVarios error consiguiendo', key, err)
			valores[key] = 'fallo'
		}
		return valores[key] //A: Para que devuelva una promesa
	})
	await Promise.all(promesas)
	console.log(cartelParaLog + ' conseguirVarios', valores)
	
	return valores
}

export function useForceUpdate() { // U: Hack to force components to update SEE: https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render
	const [value, setValue] = useState(0); // integer state
	return () => setValue(value => value + 1); // update the state to force render
}
