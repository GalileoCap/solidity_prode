//import React, { useState, useEffect } from 'react'
//import { Container, Button, Modal }  from 'semantic-ui-react'

//import { Web3ReactProvider } from '@web3-react/core'
//import { Web3Provider } from '@ethersproject/providers'
//import { useWeb3React } from '@web3-react/core'

//[> S: UI Manager *******************************************<]

import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

import geography from './argentina-provinces.json' //FROM: https://raw.githubusercontent.com/deldersveld/topojson/master/countries/argentina/argentina-provinces.json
import { provinces } from '../data.json'

function Province({ geo, onClickProvince, bets }) {
	const id = geo.properties.ID_1

	const getColor = () => {
		const side = bets[id - 1]
		if (side) {
			return 'red'
		} else {
			return '#D6D6DA'
		}
	}

	return (
		<Geography
			geography={geo}
			onClick={() => {
				onClickProvince(geo.properties)
			}}
			style={{
				default: {
					fill: getColor(),
					outline: "none"
				},
				hover: {
					fill: "#F53",
					outline: "none"
				},
				pressed: {
					fill: "#E42",
					outline: "none"
				}
			}}
		/>
	)
}

const Map = ({ onClickProvince, bets }) => {
  return (
    <>
      <ComposableMap
				data-tip=""
				projectionConfig={{ scale: 700, center: [-65.45, -42.58] }}
				projection='geoMercator'
        style={{
					width: "100%",
					height: "500",
				}}>
				<Geographies geography={geography}>
					{({ geographies }) => geographies.map(geo => (
							<Province
								key={geo.rsmKey}
								geo={geo}
								onClickProvince={onClickProvince}
								bets={bets} />
						))
					}
				</Geographies>
      </ComposableMap>
    </>
  );
};

export default memo(Map);
