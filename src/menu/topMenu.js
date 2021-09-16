import React from 'react'
import { Menu, Container, Dropdown } from 'semantic-ui-react'

/* S: UI *************************************************************/

export default function TopMenu() {
	return (
		<Menu fixed='top' inverted>
			<Container>
				<Menu.Item as='a' href='/GaliProde' header content='GaliProde' />
				<Menu.Item as='a' href='/GaliProde/current' content='Current Games' />
			</Container>
		</Menu>
	)
}
