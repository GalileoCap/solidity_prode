import React, { useState, useEffect } from 'react'
import { Container, Header, Grid, List, Image, Button }  from 'semantic-ui-react'

import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { setPath } from './utils/urls.js'

function ComoSeJuega() {
	//TODO: Font for the step numbers
	return (
		<Container>
			<Header as='h1' inverted content='¿Cómo se juega?' />
			<List as='ol'>
				<List.Item as='li'>
					Elegí una provincia
				</List.Item>
				<List.Item as='li'>
					Ajustá los porcentajes para cada partido
				</List.Item>
				<List.Item as='li'>
					Elegí cuántas fichas querés comprar
				</List.Item>
			</List>
			<Button primary onClick={() => setPath('current')} style={{marginTop: '1em'}} content='Apostá ahora y ganá!' />
		</Container>
	)
}

function Apostar() {
	//TODO: Fix paths
	return (
		<Container style={{display: 'flex'}}>
			<Image fluid src='../src/image.png' />
			<Button color='red' style={{position: 'absolute', marginTop: '2em', marginLeft: '4em'}}onClick={() => setPath('current')} content='Apostar Ahora!' />
		</Container>
	)
}

function VideoExplicativo() {
	return (
		<Container>
			TODO: Video explicativo
		</Container>
	)
}

export default function Landing() {
	const totalPool = 1936753 //TODO: Get pool from contract

	//TODO: Set pool font & size
	return (
		<Container style={{marginTop: '5em', textAlign: 'center'}}>
			<Header style={{fontFamily: 'Ubuntu', fontSize: '2.5em', marginTop:'2.3em', marginBottom:'1em'}}>
				¡POZO ${totalPool}!
			</Header>
			<Grid rows={2} style={{marginLeft: '2em', marginRight: '2em'}}>
				<Grid.Row columns={3}>
					<Grid.Column color='grey' width={7} children={<ComoSeJuega />} />
					<Grid.Column width={2} />
					<Grid.Column width={7} children={<Apostar />}/>
				</Grid.Row>
				<Grid.Row columns={1} style={{marginTop: '1.3em'}}>
					<Grid.Column color='green' children={<VideoExplicativo />}/>
				</Grid.Row>
			</Grid>
		</Container>
	)
}
