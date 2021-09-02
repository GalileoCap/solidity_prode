import React, { useState, useEffect } from 'react'
import { Menu, Container, Divider, Dropdown, Grid, Header, Image, List, Segment } from 'semantic-ui-react'

/* S: API ************************************************************/

/* S: UI *************************************************************/

export function TopMenu() {
	return (
		<Menu fixed='top' inverted>
			<Container>
				<Menu.Item as='a' header>
				GaliProde
				</Menu.Item>
				<Menu.Item as='a' href='/current'>Current Games</Menu.Item>
			</Container>
		</Menu>
	)
}

export function BottomMenu() {
	//TODO: Links
	return (
		<Segment inverted vertical style={{ marginTop: '1em' }}>
      <Container textAlign='center'>
        <Image centered size='mini' src='/logo.png' />
        <List horizontal inverted divided link size='small'>
          <List.Item as='a' href='#'>
            Site Map
          </List.Item>
          <List.Item as='a' href='#'>
            Contact Us
          </List.Item>
          <List.Item as='a' href='#'>
            Terms and Conditions
          </List.Item>
          <List.Item as='a' href='#'>
            Privacy Policy
          </List.Item>
        </List>
      </Container>
    </Segment>
	)
}
