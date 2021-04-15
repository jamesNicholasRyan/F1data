import React, { useEffect, useState } from 'react'
// import mapboxgl from 'mapbox-gl'
import ReactMapGL, { Marker } from 'react-map-gl'
import markerIcon from '../assets/location-icon.png'
import { Link } from 'react-router-dom'

const Map = ({ data, config }) => {
  const [viewPort, setViewPort] = useState(config)
  const [markerData, setMarkerData] = useState([])
  const markerLabelStyle = {
    display: 'block',
    fontSize: '12px'
  }
  // let markers = ''

  // useEffect(() => {
  //   // console.log(props.data)
  //   markers = ''
  //   setMarkerData(props.data)
  // }, [props.data])
  
  // if (markerData) {
  //   console.log(markerData)
  //   markers = markerData.map((circuit, i) => {
  //     const latLong = {
  //       lat: Number(circuit.Location.lat),
  //       long: Number(circuit.Location.long)
  //     }
  //     const name = circuit.circuitName
  
  //     return <Marker key={i} latitude={latLong.lat} longitude={latLong.long}>
  //       <Link to={`/F1data/circuits/${circuit.circuitId}`}>
  //         <div className={'markerInner'}>
  //           <p id={circuit.circuitId} style={markerLabelStyle}>{name}</p>
  //         </div>
  //       </Link>
  //     </Marker>
  //   })
  // }

  if (!data) {
    data = []
  }

  const markers = data.map(circuit => {
      const latLong = {
          lat: Number(circuit.Location.lat),
          long: Number(circuit.Location.long)
      }
      const m = <Marker key={circuit.circuitId} latitude={latLong.lat} longitude={latLong.long}>
        <Link to={`/F1data/circuits/${circuit.circuitId}`}>
          <div className={'markerInner'}>
            <p id={circuit.circuitId} style={markerLabelStyle}>{circuit.circuitName}</p>
          </div>
        </Link>
      </Marker>
      return m
    })

  return <ReactMapGL
    { ...viewPort }
    onViewportChange={(viewPort) => setViewPort(viewPort)}
    mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
    mapStyle="mapbox://styles/mapbox/dark-v9"
  >
    {/* { viewPort.zoom > 4 ? markers : null } */}
    { markers }
  </ReactMapGL>
}

export default Map