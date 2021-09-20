import React, { useState, useEffect } from 'react'
import { Container, Header, Grid, List, Image, Button }  from 'semantic-ui-react'

import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { setPath } from './utils/urls.js'

function ComoSeJuega({ only }) {
	//TODO: Font for the step numbers
	return (
		<Grid.Column only={only} color='grey' width={7}>
			<Header as='h1' inverted content='¿Cómo se juega?' />
			<List as='ol'>
				<List.Item as='li'>
					Elegí una provincia
				</List.Item>
				<p />
				<List.Item as='li'>
					Ajustá los porcentajes para cada partido
				</List.Item>
				<p />
				<List.Item as='li'>
					Elegí cuántas fichas querés comprar
				</List.Item>
			</List>
			<Button primary onClick={() => setPath('current')} style={{marginTop: '1em'}} content='Apostá ahora y ganá!' />
		</Grid.Column>
	)
}

function Apostar() {
	//TODO: Fix paths
	return (
		<Grid.Column width={7} style={{display: 'flex', alignItems: 'center'}}> 
			<Image fluid src='../resources/image.png' />
			<Button color='red' style={{position: 'absolute'}} onClick={() => setPath('current')} content='Apostar Ahora!' />
		</Grid.Column>
	)
}

function VideoExplicativo() {
	return (
		<Grid.Row columns={1} style={{marginTop: '1.3em'}}>
			<Grid.Column color='green'>
				TODO: Video explicativo
			</Grid.Column>
		</Grid.Row>
	)
}

export default function Landing() {
	const totalPool = 1936753 //TODO: Get pool from contract

	//TODO: Set pool font & size
	return (
		<Container style={{marginTop: '5em', textAlign: 'center'}}>
			<Header style={{fontFamily: 'Alpha Slab One', fontSize: '2.5em', marginTop:'2.3em', marginBottom: '0.8em'}}>
				¡POZO ${totalPool}!
			</Header>
			<Grid rows={2} stackable style={{marginLeft: '2em', marginRight: '2em'}}>
				<Grid.Row columns={3}>
					<ComoSeJuega only='computer tablet' />
					<Grid.Column only='computer tablet' width={2} />
					<Apostar />
					<Grid.Column only='mobile' width={2} />
					<ComoSeJuega only='mobile' />
				</Grid.Row>
				<VideoExplicativo />
			</Grid>
		</Container>
	)
}
