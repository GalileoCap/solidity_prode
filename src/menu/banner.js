import React from 'react'
import { Menu, Header } from 'semantic-ui-react'

/* S: UI *************************************************************/

export default function Banner({ setPath }) {
	//TODO: Image
	
	return (
		<Menu fixed='top' widths={1} inverted size='massive' onClick={() => setPath('') }>
			<Menu.Item>
				<Header as='h1' inverted content='(Tu Marca)' />
			</Menu.Item>
		</Menu>
	)
}
