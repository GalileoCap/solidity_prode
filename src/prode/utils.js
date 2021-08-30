/* S: Utils *************************************************/

async function conseguirVarios(comoConseguir, cartelParaLog = '') { //U: Recibe un diccionario de las claves y la funcion que consigue su valor. Y espera a que se cumplan todas las promesas
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

export {conseguirVarios}
