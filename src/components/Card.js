import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import getCircuitMaps from '../utils/getCircuitMaps.js'

// function importAll(r) {
//   return r.keys().map(r);
// }

const circuitMaps = getCircuitMaps()

// const images = importAll(require.context('../assets/circuitMaps/', false, /\.(png|jpe?g|svg)$/));

// console.log(images)

const Card = ({ circuit }) => {
  // console.log(`https://res.cloudinary.com/dn39ocqwt/image/upload/v1618480792/circuit-mapper/${circuit.circuitId}.png`)

  return <div className={'card-outer'}><Link 
    key={circuit.circuitId} 
    to={{
      pathname: `/F1data/circuits/${circuit.circuitId}`,
    }}
    >
      <div className='circuit-card'>
        <div className={'circuit-card-image-container'}>
          
          <img src={circuitMaps[circuit.circuitId]} className={'circuit-card-image'}alt={'Circuit Image'} />
        </div>
        <div className={'circuit-card-info'}>
          <h4>{circuit.circuitName}</h4>
        </div>
      </div>
    </Link>
  </div>
}

export default Card