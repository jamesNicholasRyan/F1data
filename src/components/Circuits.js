import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Map from './Map'

import LocationIcon from '../location-icon.png'
import Table from './Table'
import Card from './Card'

const Circuits = () => {
  const [circuits, setCircuits] = useState([])
  const [filterYear, setFilterYear] = useState('yyyy')
  const [filterTerm, setFilterTerm] = useState('')
  const [filteredCircuits, setFilteredCircuits] = useState([])
  const [activeYears, setActiveYears] = useState([])
  const [showMap, setShowMap] = useState(true)

  // Provides circuit data
  useEffect(() => {
    fetch('https://ergast.com/api/f1/circuits.json?limit=78')
      .then((resp) => resp.json())
      .then((data) => {
        setCircuits(data.MRData.CircuitTable.Circuits)
        setFilteredCircuits(data.MRData.CircuitTable.Circuits)
      })
  }, [])

  useEffect(() => {
    fetch('https://ergast.com/api/f1/seasons.json?limit=100')
      .then((resp) => resp.json())
      .then((seasonsData) => {
        const years = seasonsData.MRData.SeasonTable.Seasons.map(season => {
          return season.season
        })
        setActiveYears(years)
      })
  }, [])

  // Apply Filters
  useEffect(() => {
    filterByYear()
  }, [filterYear])

  function filterByYear(){
    console.log('filtering by year')
    if (filterYear === 'yyyy') {
      return setFilteredCircuits(circuits)
    }
    fetch(`https://ergast.com/api/f1/${filterYear}/circuits.json`)
      .then((resp) => resp.json())
      .then((data) => {
        setFilteredCircuits(data.MRData.CircuitTable.Circuits)
      })
  }


  function filterCircuitsByName() {
    filterByYear()

    const filtered = filteredCircuits.filter((circuit) => {
      return circuit.circuitName.toLowerCase().includes(filterTerm.toLowerCase())
    })
    setFilteredCircuits(filtered)
    mapConfig = {
      height: '100vh',
      width: '100vw',
      zoom: 4.5,
      latitude: 51.515,
      longitude: -0.078
    }
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
        style={ showMap === false ? { color: 'grey' } : { color: '#32bebe' }}
        onClick={() => setShowMap(true)}>language</span>
    </div>
    <div>
      <span 
        className="material-icons"
        style={ showMap === false ? { color: '#32bebe' } : { color: 'grey' }}
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
      <Map config={mapConfig} data={filteredCircuits}/>
    </div>
  } else {
    body = <div className={'card-container'}>
      {filteredCircuits.map((circuit) => {
        return <Card key={circuit.circuitId} circuit={circuit} />
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
            setFilterTerm(event.target.value)
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              filterCircuitsByName()
            }
          }}
          value={filterTerm}
        />
        <span className="material-icons">search</span>
      </div>
      
    </div>

    {mapToggleButton}

    {body}
    
  </div>

}

export default Circuits