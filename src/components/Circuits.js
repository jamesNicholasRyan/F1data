import React, { useEffect, useState, useReducer } from 'react'
import { Link } from 'react-router-dom'
import Map from './Map'

import LocationIcon from '../location-icon.png'
import Table from './Table'
import Card from './Card'

const initialState = {
  circuits: [],
  filteredCircuits: [],
  filterYear: 'yyyy',
  error: null
}

const reducer = (state, action) => {
  switch (action.type) {

    case 'FETCH_SUCCESS':
      return {
        ...state,
        circuits: action.payload,
        filteredCircuits: action.payload
      }
    case 'FETCH_ERROR':
      return {
        ...state,
        error: action.error
      }
    case 'FILTER_YEAR':
      return {
        ...state,
        filterYear: action.payload.year,
        filteredCircuits: action.payload.filteredCircuits
      }
    case 'FILTER_NAME': 
      return {
        ...state,
        filteredCircuits: action.payload.filteredCircuits
      }
  }
}

const Circuits = () => {

  const [state, dispatch] = useReducer(reducer, initialState)
  // const [circuits, setCircuits] = useState([])
  // const [filterYear, setFilterYear] = useState('yyyy')
  const [filterTerm, setFilterTerm] = useState('')
  const [filteredCircuits, setFilteredCircuits] = useState([])
  const [activeYears, setActiveYears] = useState([])
  const [showMap, setShowMap] = useState(true)

  // Provides circuit data
  useEffect(() => {
    fetch('https://ergast.com/api/f1/circuits.json?limit=78')
      .then((resp) => resp.json())
      .then((data) => {
        return dispatch({ type: 'FETCH_SUCCESS', payload: data.MRData.CircuitTable.Circuits })
      })
      .catch(err => {
        return dispatch({ type: 'FETCH_ERROR', error: err})
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
  // useEffect(() => {
  //   filterByYear()
  // }, [filterYear])

  // function filterByYear(){
  //   if (filterYear === 'yyyy') {
  //     return setFilteredCircuits(circuits)
  //   }
  //   fetch(`https://ergast.com/api/f1/${filterYear}/circuits.json`)
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       setFilteredCircuits(data.MRData.CircuitTable.Circuits)
  //     })
  // }

  function filterByYear(year){
    if (year === 'yyyy') {
      return dispatch({ 
        type: 'FILTER_YEAR', 
        payload: {
          year: year,
          filteredCircuits: state.circuits
        }
      })
    }

    fetch(`https://ergast.com/api/f1/${year}/circuits.json`)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({
          type: 'FILTER_YEAR',
          payload: {
            year: year,
            filteredCircuits: data.MRData.CircuitTable.Circuits
          }
        })
      })
  }


  function filterCircuitsByName(searchTerm) {
    // filterByYear(state.filterYear)

    if (state.filterYear === 'yyyy') {
      const filtered = state.circuits.filter((circuit) => {
          return circuit.circuitName.toLowerCase().includes(searchTerm.toLowerCase())
      })
    // setFilteredCircuits(filtered)
      return dispatch({ 
        type: 'FILTER_NAME',
        payload: {
          filteredCircuits: filtered
        }
      })
    }

    fetch(`https://ergast.com/api/f1/${state.filterYear}/circuits.json`)
      .then((resp) => resp.json())
      .then((data) => {
        const circuits = data.MRData.CircuitTable.Circuits
        const filtered = circuits.filter((circuit) => {
          return circuit.circuitName.toLowerCase().includes(searchTerm.toLowerCase())
        })
    // setFilteredCircuits(filtered)
        dispatch({ 
          type: 'FILTER_NAME',
          payload: {
            filteredCircuits: filtered
          }
        })
      })
    const filtered = state.filteredCircuits.filter((circuit) => {
      return circuit.circuitName.toLowerCase().includes(searchTerm.toLowerCase())
    })
    // setFilteredCircuits(filtered)
    dispatch({ 
      type: 'FILTER_NAME',
      payload: {
        filteredCircuits: filtered
      }
    })
  }

  const yearSelectBox = <select 
    className={'year-select'}
    value={state.filterYear}
    // onChange={event => setFilterYear(event.target.value)}  
    onChange={event => filterByYear(event.target.value)}  
    >
      <option key={'empty'} disabled value={'yyyy'}>Select Year</option>
    {activeYears.map(year => {
      return <option key={year} value={year}>{year}</option>
    })}
  </select>

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
      <Map config={mapConfig} data={state.filteredCircuits}/>
    </div>
  } else {
    body = <div className={'card-container'}>
      {state.filteredCircuits.map((circuit) => {
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
              filterCircuitsByName(event.target.value)
            }
          }}
          value={filterTerm}
        />
        <span className="material-icons">search</span>
      </div>
      <div className={'toggle-view'}>
       <span 
         className="material-icons"
         style={ showMap === false ? { color: 'grey' } : { color: '#32bebe' }}
         onClick={() => setShowMap(true)}>language</span>
      </div>
      <div className={'toggle-view'}>
        <span 
          className="material-icons"
          style={ showMap === false ? { color: '#32bebe' } : { color: 'grey' }}
          onClick={() => setShowMap(false)}>view_module</span>
      </div>

      {/* {mapToggleButton} */}
    </div>

    

    {body}
    
  </div>

}

export default Circuits