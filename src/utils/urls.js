export function parseUrl(loc) {
	const path = loc.pathname.split('/').slice(1)
	const search = {} //A: Dictionary of parameter: value
	loc.search.slice(1).split('&').map(x => x.split('=')).forEach(x => { search[x[0]] = x[1] })

	return {
		path,
		search,
	}
}

export function setPath(to, keep = 1) { 
	const { path } = parseUrl(window.location)

	window.location = `/${path.slice(0, keep).join('/')}/${to}`
}
