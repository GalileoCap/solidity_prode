import React from 'react'
import { Menu, Header } from 'semantic-ui-react'

import { setPath } from './utils/urls.js'

/* S: UI *************************************************************/

export default function Banner() {
	//TODO: Image
	
	return (
		<Menu fixed='top' widths={1} inverted size='massive' onClick={() => setPath('') }>
			<Menu.Item>
				<Header as='h1' inverted content='GaliProde' />
			</Menu.Item>
		</Menu>
	)
}
