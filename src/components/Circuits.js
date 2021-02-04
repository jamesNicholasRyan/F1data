import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Map from './Map'

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
        // console.log(seasonsData.MRData.SeasonTable.Seasons)
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
      <option key={'empty'} selected disabled value={'yyyy'}>Select Year</option>
    {activeYears.map(year => {
      return <option key={year} value={year}>{year}</option>
    })}
  </select>

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
        <span>()</span>
      </div>
      

      {/* <button onClick={filterCircuits}>SEARCH</button> */}

    </div>

    

    <div id={'map-container'}>
      <Map data={circuits}/>
    </div>

    {filterCircuitsByName().map((circuit) => {
      return <Link 
        key={circuit.circuitId} 
        to={{
          pathname: `/circuits/${circuit.circuitId}`,
        }}
        >
          <div className='circuitCard'>
          {circuit.circuitName}
        </div>
      </Link>
    })}
    
  </div>

}

export default Circuits