import React, { useEffect, useState } from 'react'
import { Nav, Sidenav, Dropdown, NavBar, Icon, Tag, TagGroup } from 'rsuite' 
import Table from './Table'
import Map from './Map'
import { RadialChart, VerticalBarSeries, XYPlot, XAxis, YAxis, LineMarkSeries,  VerticalGridLines, HorizontalGridLines  } from 'react-vis'

import Adelaide from '../assets/circuitMaps/adelaide.svg'
import Mugello from '../assets/circuitMaps/mugello.svg'
import Silverstone from '../assets/circuitMaps/silverstone.png'
import getCircuitMaps from '../utils/getCircuitMaps'
import greyFlag from '../assets/grey_flag.png'
import LapTimes from './LapTimes'
import ScaleLoader from 'react-spinners/ScaleLoader'

const circuitMaps = getCircuitMaps()

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
  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState([])
  const [isTooltipShown, updateTooltip] = useState(false)
  const [isPieChart, updateisPieChart] = useState(false)
  const [nationality, setNationalilty] = useState('')
  const [flags, setFlags] = useState([])
  const [allCountries, setCountries] = useState([])
  const [lapData, setLapData] = useState([])
  const [lapDataLoaded, toggleLapDataLoaded] = useState(false)
  const circuitName = match.params.id
  const [lapIsLoading, setLapLoading] = useState(false)

  useEffect(() => {
    fetch(`https://ergast.com/api/f1/circuits/${match.params.id}.json`)
      .then(resp => resp.json())
      .then(data => {
        const circuitObj = data.MRData.CircuitTable.Circuits[0]
        setCircuit(circuitObj)
        setLoading(false)
      })
    
    fetch(`https://ergast.com/api/f1/circuits/${match.params.id}/seasons.json?limit=100`)
      .then(resp => resp.json())
      .then(data => {
          const seasonArr = data.MRData.SeasonTable.Seasons
          setSeasonList(seasonArr)
    })
  }, [])

  // ---------------------------- FETCHING COUNTRY FLAG ----------------------------------------- //

  useEffect(() => {
    let country = circuit.Location.country
    if (country === 'UK') {
      country = 'united kingdom'
    } if (country === 'Korea') {
      country = 'Korea (Republic of)'
    }

    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      .then(resp => resp.json())
      .then(countryData => {
        const flag = countryData[0].flag
        setFlag(flag)
      })

    fetch(`https://restcountries.eu/rest/v2/all`)
      .then(resp => resp.json())
      .then((countryData2) => {
        setCountries(countryData2)
      })
  }, [loading])

  useEffect(() => {
    const updatedMapConfig = {
      height: '400px',
      // width: window.innerWidth > 360 ? 360 : window.innerWidth,
      width: window.innerWidth < 600 ? window.innerWidth - 20 : 600,
      maxWidth: '600px',
      zoom: 14,
    }
    updatedMapConfig.latitude = Number(circuit.Location.lat)
    updatedMapConfig.longitude = Number(circuit.Location.long)
    setMapConfig(updatedMapConfig)
  }, [circuit])


  function fetchRace(year) {
    fetch(`https://ergast.com/api/f1/${year}/circuits/${circuit.circuitId}/results.json`)
    .then(resp => resp.json())
    .then(data => {

      const race = data.MRData.RaceTable.Races[0]
      if (race) {
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
            changeArrow = <span className="material-icons" style={{ color: 'green'}}>keyboard_arrow_up</span>
          } else if (positionChange < 0) {
            changeArrow = <span className="material-icons" style={{ color: 'red'}}>keyboard_arrow_down</span>
          } else if (positionChange === 0) {
            changeArrow = <span className="material-icons">horizontal_rule</span>
          }

          const filteredCountry = allCountries.find((country) => {
            let driverCountry = ''
            if (result.Driver.nationality === 'Argentine') {
              driverCountry = 'Argentinean'
            } else if (result.Driver.nationality === 'Dutch') {
              return country.name === 'Netherlands'
            } else {
              driverCountry = result.Driver.nationality
            }
            return country.demonym === driverCountry
          })

          let flag = ''
          if (filteredCountry) {
            flag = <img width='30' src={filteredCountry.flag} alt={result.Driver.nationality}></img>
          } else {
            flag = <img width='30' height='18' src={greyFlag} alt='No flag available' style={{backgroundColor: 'grey'}}></img>
          }

          return {
            position: result.position,
            driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
            constructor: result.Constructor.name, 
            time: time,
            grid: result.grid,
            positionChange: positionChange,
            changeArrow: changeArrow,
            nationality: result.Driver.nationality,
            flag: flag,
          }
        })

        // --------------------------- creating pie chart data ----------------------------------------- //

        const nationalityData = raceResults.map((driver) => {
          return driver.nationality
        })
        const finalPieData = {}
        nationalityData.forEach((nationality) => {
          if (finalPieData[nationality] !== undefined) {
            finalPieData[nationality] += 1
          } else {
            finalPieData[nationality] = 1
          }
        })
        const sortedPieData = Object.fromEntries(
          Object.entries(finalPieData).sort(([,a],[,b]) => a-b)
        );
        const pieKeys = Object.keys(sortedPieData) // ['british', 'brazillian'..]
        const pieData = pieKeys.map(segment => {
          return {
            angle: finalPieData[segment],
            label: segment
          }
        })

        setPieData(pieData)
        updateisPieChart(true)
        setRaceInfo(race)
        setResults(raceResults)
      }

      // --------------------- CREATING LAPTIMES DATA ---------------------------------------- //

      const round = data.MRData.RaceTable.Races[0].round
      const driverList = race.Results.map((driver) => {
        return driver.Driver.driverId
      })

      async function fecthLapTimes(driver) {
        toggleLapDataLoaded(true)
        setLapLoading(true)
        const response = await fetch(`https://ergast.com/api/f1/${year}/${round}/drivers/${driver}/laps.json`)
        const laps = await response.json()
        return laps
      }
      setLapData([])
      // console.log('fetching data')
      driverList.forEach((driver) => {
        fecthLapTimes(driver).then(lapData => {
          // console.log(data.MRData.RaceTable.Races[0].Laps)
          const driverLaps = lapData.MRData.RaceTable.Races[0].Laps
          const newTimings = driverLaps.map((lap) => {
            return { 
              x: Number(lap.number), 
              // y: lap.Timings[0].time
              y: convertTime(lap.Timings[0].time)
            }
          })
          const driverData = { driver: driver, lapTimes: newTimings }
          setLapData(oldArray => [...oldArray, driverData])
        })
    
      })
      // console.log('finished')
      // setLapLoading(false)
    })

  }


  function convertTime(time) {
    const colonSplit = time.split(':')
    const numbers = colonSplit.map((word) => Number(word))
    const finalSeconds = (numbers[0] * 60) + (numbers[1])
    // console.log(finalSeconds)
    return finalSeconds
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

  let times 
  if (lapData) {
    times = <div className='lapTimes-container'>
      <LapTimes
        data={lapData}
        setLapLoading={setLapLoading}
      />
    </div>
  }

  function toggleToolTip(datapoint) {
    updateTooltip(!isTooltipShown)
    setNationalilty(datapoint.label)
  }

  return <div className={'page-background'}>
    <div className={'container'}>

      <div className={'container-left-column'}>
        
        <div className={'circuitInfo'}>
          <div className={'circuit-info-text'}>
            <h1><a href={circuit.url} target='_blank'>{circuit.circuitName}</a></h1>
            <div className={'location'}>
              <span>
                <img width='50' className='circuit-flag' src={flag}></img>
              </span>
              {circuit.Location.locality} - {circuit.Location.country}</div>
          </div>

          <div className={'circuit-image-container'}>
            <img src={circuitMaps[circuit.circuitId]} className={'circuit-image'}></img>
          </div>
        </div>

        {map}

        <div className='seasons-title'>SEASONS:</div>
        <div className='tag-container'>
          <div className='tag-group'>
            {seasonList.map((season) => {
              if (season.season !== '2021') { // excluding year 2021
                return <div className='tag' key={season.season} color="blue" onClick={(event) => {fetchRace(event.target.innerText)}}>
                {/* <div>{season.season}</div> */}
                <span className='year-text'>{season.season}</span>
              </div>
              }
            })}
          </div>
        </div>

      {/* --------------------------- RESULTS TABLE HERE ------------------------------------ */}
        <div className='info-container'>  
          {raceInfoJSX}
          <div className='table-container'>
            {table}
          </div>          
        </div>
        
        <div className='chart-container'>
          {/* <div className='pie-container'>
            <div style={{
                display: isPieChart ? 'block' : 'none',}}>Nationalities</div>
            <RadialChart className='pieChart'  
              data={pieData}
              width={300}
              height={300}
              onValueMouseOut={(datapoint, event) => toggleToolTip(datapoint)}
              onValueMouseOver={(datapoint, event) => toggleToolTip(datapoint)}
              />
            <div 
              className='toolTip'
              style={{
                display: isTooltipShown ? 'block' : 'none',
                // position: `absolute`,
                textAlign: 'center',
                backgroundColor: `white`,
                borderRadius: `10px`,
                width: '120px',
                boxShadow: '2px 2px 1px rgb(0,0,0,0.1)',
                zIndex: '2'
              }}
              >
              <div>{nationality}</div>
            </div>
          </div> */}

          <div className='chart-container'>
            {/* <div className='spinner-container'>
              <ScaleLoader 
                className='spinner'
                color={'blue'} 
                loading={lapIsLoading} 
                size={100} 
                style={{zIndex: '1'}}  
              />
            </div> */}
            {lapDataLoaded && times}
          </div>
        
        </div>
        
      </div>
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