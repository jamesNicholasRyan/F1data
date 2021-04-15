import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import getCircuitMaps from '../utils/getCircuitMaps.js'

const circuitMaps = getCircuitMaps()

const Card = ({ circuit }) => {

  return <div className={'card-outer'}><Link 
    key={circuit.circuitId} 
    to={{
      pathname: `/F1data/circuits/${circuit.circuitId}`,
    }}
    >
      <div className='circuit-card'>
        <div className={'circuit-card-image-container'}>
          
          <img src={circuitMaps[circuit.circuitId]} className={'circuit-card-image'} alt={circuit.circuitName} />
        </div>
        <div className={'circuit-card-info'}>
          <h4>{circuit.circuitName}</h4>
        </div>
      </div>
    </Link>
  </div>
}

export default Card