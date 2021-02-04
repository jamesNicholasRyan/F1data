import React, { useEffect, useState } from 'react'
import { Nav, Sidenav, Dropdown, NavBar, Icon, Tag, TagGroup } from 'rsuite' 
import Table from './Table'
import Map from './Map'
// import Adelaide from './assets/circuitMaps/adelaide.svg'

const Circuit = ( { match } ) => {
  const [circuit, setCircuit] = useState({
    circuitId: '',
    circuitName: '',
    Location: {
      lat: 0,
      long: 0
    },
    url: ''
  })

  const [raceInfo, setRaceInfo] = useState({
    Results: {},
    date: '',
    raceName: '',
    round: '',
    season: '',
  })

  const [mapConfig, setMapConfig] = useState({})

  const [flag, setFlag] = useState([])
  const [seasonList, setSeasonList] = useState([])
  const [results, setResults] = useState([])
  // const [map, setMap] = useState('')

  const [loading, setLoading] = useState(true)
  const circuitName = match.params.id

  useEffect(() => {
    fetch(`http://ergast.com/api/f1/circuits/${match.params.id}.json`)
      .then(resp => resp.json())
      .then(data => {
        const circuitObj = data.MRData.CircuitTable.Circuits[0]
        setCircuit(circuitObj)
        setLoading(false)
      })
    
    fetch(`http://ergast.com/api/f1/circuits/${match.params.id}/seasons.json?limit=100`)
      .then(resp => resp.json())
      .then(data => {
          const seasonArr = data.MRData.SeasonTable.Seasons
          setSeasonList(seasonArr)
    })
  }, [])

   // ---------------------------- FETCHING COUNTRY FLAG ----------------------------------------------- //

  useEffect(() => {
    const country = circuit.Location.country
    console.log(country)
    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      .then(resp => resp.json())
      .then(countryData => {
        // console.log(countryData[0])
        const flag = countryData[0].flag
        setFlag(flag)
      })
    // console.log('circuit ', circuit.Location.country)
  }, [loading])

  useEffect(() => {
    const updatedMapConfig = {
      height: '400px',
      width: '800px',
      zoom: 13,
    }
    updatedMapConfig.latitude = Number(circuit.Location.lat)
    updatedMapConfig.longitude = Number(circuit.Location.long)
    setMapConfig(updatedMapConfig)
  }, [circuit])

  function fetchRace(year) {
    fetch(`http://ergast.com/api/f1/${year}/circuits/${circuit.circuitId}/results.json`)
    .then(resp => resp.json())
    .then(data => {

      const race = data.MRData.RaceTable.Races[0]
      if (race){
        console.log(race.Results)
        const raceResults = race.Results.map(result => {
          let time =  ''
          if (result.status === 'Finished') {
            time = result.Time.time
          } else if (result.status[0] !== '+') {
            time = 'DNF'
          } else {
            time = result.status
          }
          const positionChange = (result.grid) - (result.position)
          let changeArrow = '' 
          if (positionChange > 0) {
            changeArrow = '^'
          } else if (positionChange < 0) {
            changeArrow = '.'
          } else if (positionChange === 0) {
            changeArrow = '-'
          }
          return {
            position: result.position,
            driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
            constructor: result.Constructor.name, 
            time: time,
            grid: result.grid,
            positionChange: positionChange,
            changeArrow: changeArrow,
          }
        })
        // console.log(raceResults)
        setRaceInfo(race)
        setResults(raceResults)
      }
    })
    // http://ergast.com/api/f1/${year}/circuits/{$.circuit.circuitId}/results.json
  }

  let raceInfoJSX = ''
  if (raceInfo.raceName) {
    raceInfoJSX = <div>
        {/* <h4>{year}</h4> */}
        <h3>{raceInfo.raceName} - {raceInfo.date}</h3>
      </div>
  }

  let table;

  if (results.length > 0) {
    table = <Table data={results}/>
  }

  let map;

  if (mapConfig.latitude) {
    map = <div className='map-container'>
      <Map config={mapConfig}/>
    </div>
  }

  return <div className={'page-background'}>
    <div className={'container'}>

      <div className={'container-left-column'}>
        <div className={'circuitInfo'}>
          <div className={'circuit-info-text'}>
            <h1><a href={circuit.url} target='_blank'>{circuit.circuitName}</a></h1>
            <div>{circuit.Location.locality} - {circuit.Location.country}</div>
            <img width='400' height='200' style={ {backgroundColor: 'grey'} } src={``}></img>
          </div>
          <img width='200' className='circuit-flag' src={flag}></img>
        </div>

      {map}

        <div className='tag-container'>
          <div className='tag-group'>
            {seasonList.map((season) => {
              return <div className='tag' key={season.season} color="blue" onClick={(event) => {fetchRace(event.target.innerText)}}>
                  {/* <div>{season.season}</div> */}
                  <span className='year-text'>{season.season}</span>
                </div>
            })}
          </div>
        </div>

      {/* --------------------------- RESULTS TABLE HERE ------------------------------------ */}
        <div className='info-container'>  
          <div className='table-container'>
            {raceInfoJSX}

            {table}
          </div>          
        </div>
        
      </div>
      {/* <aside className={'container-right-column'}>
        <SideBar 
          seasonList={seasonList}
          fetchRace={fetchRace}
        /> 
      </aside> */}
        
      
      </div>
  </div>
  
}

// function SideBar( { seasonList, fetchRace } ) {
//   {/* ---------------------------  YEARS ASIDE -------------------------------------- */}
//   return <div>
//   <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
//       <Sidenav.Body>
//         <Nav style={bodyStyles}>
//           <Nav.Item 
//             eventKey="1"
//             icon={<Icon icon="dashboard" />}
//             style={headerStyles}
//             active
//             >
//               SEASON:
//           </Nav.Item >
//             {seasonList.map((season) => {
//               return <Nav.Item key={season.season} style={panelStyles} onClick={(event) => {fetchRace(event.target.innerText)}}>
//                   <div>{season.season}</div>
//                 </Nav.Item>
//             })}
//         </Nav>
//       </Sidenav.Body>
//     </Sidenav>
//   </div>
// }

const headerStyles = {
  padding: 20,
  fontSize: 16,
  background: 'rgb(50,190,190)',
  color: '#fff',
  // borderRadius: '5px',
  margin: '0px',
};

const panelStyles = {
  listStyleType: 'none',
  padding: '15px 20px',
  color: 'rgb(50,190,190)',
  margin: '0px',
  // padding: '0px',
  // height: '50px',
  border: '1px solid rgb(190,190,190)'
};

const bodyStyles = {
  // border: '1px solid rgb(50,190,190)',
  // margin: '0px',
  // padding: '0px',
};

export default Circuit