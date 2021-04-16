import React, { useEffect, useState, useReducer } from 'react'
import { Link } from 'react-router-dom'
import Map from './Map'

import LocationIcon from '../location-icon.png'
import SeasonsFilter from './SeasonsFilter'
import Card from './Card'

const initialState = {
  circuits: [],
  filteredCircuits: [],
  selectedSeason: 'yyyy',
  searchTerm: '',
  seasons: [],
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
    case 'FILTER_SEASON':
      return {
        ...state,
        selectedSeason: action.payload.year,
        filteredCircuits: action.payload.filteredCircuits
      }
    case 'FILTER_NAME': 
      return {
        ...state,
        filteredCircuits: action.payload.filteredCircuits
      }
    case 'SET_SEARCH_TERM': 
      return {
        ...state,
        searchTerm: action.payload
      }
    case 'FETCH_SEASONS':
      return {
        ...state,
        seasons: action.payload
      }
    default:
      return state
  }
}

const Circuits = () => {

  const [state, dispatch] = useReducer(reducer, initialState)
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
        dispatch({ type: 'FETCH_SEASONS', payload: years })
      })
  }, [])

  function filterByYear(year){
    if (year === 'yyyy') {
      return dispatch({ 
        type: 'FILTER_SEASON', 
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
          type: 'FILTER_SEASON',
          payload: {
            year: year,
            filteredCircuits: data.MRData.CircuitTable.Circuits
          }
        })
      })
  }


  function filterCircuitsByName(searchTerm) {
    // filterByYear(state.selectedSeason)

    if (state.selectedSeason === 'yyyy') {
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

    fetch(`https://ergast.com/api/f1/${state.selectedSeason}/circuits.json`)
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
    value={state.selectedSeason}
    onChange={event => filterByYear(event.target.value)}  
    >
      <option key={'empty'} disabled value={'yyyy'}>Select Year</option>
    {state.seasons.map(year => {
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

    <SeasonsFilter clickHandler={(season) => filterByYear(season)} seasons={state.seasons} />
    <div className={'search-container'}>


      {/* {yearSelectBox} */}

      <div className={'search-input-container'}>
        <input 
          type='text'
          placeholder='Search by name...'
          className={'search-input'}
          onChange={(event) => {
            dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value })
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              filterCircuitsByName(state.searchTerm)
            }
          }}
          value={state.searchTerm}
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