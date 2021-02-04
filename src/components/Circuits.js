import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Map from './Map'

import LocationIcon from '../location-icon.png'
import Table from './Table'

const Circuits = () => {
  const [circuits, setCircuits] = useState([])
  const [filterYear, setFilterYear] = useState('yyyy')
  const [filterName, setFilterName] = useState('')
  const [activeYears, setActiveYears] = useState([])
  const [showMap, setShowMap] = useState(true)

  useEffect(() => {
    fetch('https://ergast.com/api/f1/circuits.json?limit=78')
      .then((resp) => resp.json())
      .then((data) => {
        setCircuits(data.MRData.CircuitTable.Circuits)
      })
  }, [])

  function filterCircuits() {
    fetch(`https://ergast.com/api/f1/${filterYear}/circuits.json`)
      .then((resp) => resp.json())
      .then((data) => {
        setCircuits(data.MRData.CircuitTable.Circuits)
      })
  }

  useEffect(() => {
    fetch('http://ergast.com/api/f1/seasons.json?limit=100')
      .then((resp) => resp.json())
      .then((seasonsData) => {
        const years = seasonsData.MRData.SeasonTable.Seasons.map(season => {
          return season.season
        })
        setActiveYears(years)
      })
  }, [])
  
  function filterCircuitsByName() {
    // if (!filterName) {
    //   return
    // }

    return circuits.filter((circuit) => {
      return circuit.circuitName.toLowerCase().includes(filterName.toLocaleLowerCase())
    })
  }  

  const yearSelectBox = <select 
    className={'year-select'}
    value={filterYear}
    onChange={event => setFilterYear(event.target.value)}  
    >
      <option key={'empty'} disabled value={'yyyy'}>Select Year</option>
    {activeYears.map(year => {
      return <option key={year} value={year}>{year}</option>
    })}
  </select>


  const mapToggleButton = <div className={'view-toggle'}>
    <div>
      <span 
        className="material-icons"
        style={ showMap === false ? { color: 'grey' } : { color: 'black' }}
        onClick={() => setShowMap(true)}>language</span>
    </div>
    <div>
      <span 
        className="material-icons"
        style={ showMap === false ? { color: 'black' } : { color: 'grey' }}
        onClick={() => setShowMap(false)}>view_module</span>
    </div>
  </div> 

  const mapConfig = {
    height: '100vh',
    width: '100vw',
    zoom: 4.5,
    latitude: 51.515,
    longitude: -0.078
  }

  let body = ''

  if (showMap) {
    body = <div id={'map-container'}>
      <Map config={mapConfig} data={circuits}/>
    </div>
  } else {
    body = <div className={'card-container'}>
      {filterCircuitsByName().map((circuit) => {
        return <div className={'card-outer'}><Link 
          key={circuit.circuitId} 
          to={{
            pathname: `/circuits/${circuit.circuitId}`,
          }}
          >
            <div className='circuit-card'>
              <div className={'circuit-card-image'}>

              </div>
              <div className={'circuit-card-info'}>
                <h4>{circuit.circuitName}</h4>
              </div>
              
            </div>
        </Link></div>
      })}
    </div>
    
  
  }


  return <div>

    <div className={'search-container'}>

      {yearSelectBox}

      <div className={'search-input-container'}>
        <input 
          type='text' 
          placeholder='Search by name...'
          className={'search-input'}
          onChange={(event) => {
            setFilterName(event.target.value)
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              console.log('search')
              filterCircuitsByName()
            }
          }}
          value={filterName}
        />
        <span className="material-icons">search</span>
      </div>
      
    </div>

    {mapToggleButton}

    {body}
    
  </div>

}

export default Circuits