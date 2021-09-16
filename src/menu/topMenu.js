import React from 'react'
import { Menu, Container, Dropdown } from 'semantic-ui-react'

/* S: UI *************************************************************/

export default function TopMenu() {
	return (
		<Menu fixed='top' inverted>
			<Container>
				<Menu.Item as='a' header href='/'>
					GaliProde
				</Menu.Item>
				<Menu.Item as='a' href='/current'>Current Games</Menu.Item>
			</Container>
		</Menu>
	)
}
