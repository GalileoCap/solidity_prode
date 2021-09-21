import React, { useState, useEffect } from 'react'
import { Container, Header, Grid, List, Image, Button }  from 'semantic-ui-react'

import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

function ComoSeJuega({ only }) {
	//TODO: Font for the step numbers
	return (
		<Grid.Column only={only} color='grey' width={8}>
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
				<List.Item>
					<Button primary onClick={() => setPath('current')} style={{marginTop: '1em'}} content='Apostá ahora y ganá!' />
				</List.Item>
			</List>
		</Grid.Column>
	)
}

function Apostar({ setPath }) {
	return (
		<Grid.Column width={8} style={{display: 'flex', alignItems: 'center'}}> 
			<Image src='./src/landing/betting.jpg' />
			<Button color='red'
				style={{position: 'absolute', width: '40%', marginLeft: '29%', heigth: '15%', marginTop: '30%'}}
				onClick={() => setPath(['elecciones'])}
				content='Apostar Ahora!'
			/>
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

export default function Landing({ setPath }) {
	const totalPool = 1936753 //TODO: Get pool from contract

	return (
		<Container style={{marginTop: '5em', textAlign: 'center'}}>
			<Header style={{fontFamily: 'Anton', fontSize: '3.5em', marginTop:'1.8em', marginBottom: '0.7em'}}>
				¡POZO ${totalPool}!
			</Header>
			<Grid rows={2} stackable style={{marginLeft: '2em', marginRight: '2em'}}>
				<Grid.Row columns={2}>
					<ComoSeJuega only='computer tablet' />
					<Apostar setPath={setPath} />
					<ComoSeJuega only='mobile' />
				</Grid.Row>
				<VideoExplicativo />
			</Grid>
		</Container>
	)
}
