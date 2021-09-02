import React from 'react'
import { Container, Image, List, Segment } from 'semantic-ui-react'

/* S: UI *************************************************************/

export default function BottomMenu() {
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
