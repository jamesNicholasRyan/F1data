import React, { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import MapGL, { Marker } from 'react-map-gl'
import markerIcon from '../assets/location-icon.png'
import { Link } from 'react-router-dom'

const Map = (props) => {

  const [viewPort, setViewPort] = useState(props.config)
  const [markerData, setMarkerData] = useState([])

  const markerLabelStyle = {
    display: 'block',
    fontSize: '12px'
  }

  let markers = ''


  useEffect(() => {
    setMarkerData(props.data)
  }, [viewPort])

  if (props.data) {
    markers = props.data.map((circuit, i) => {
      const latLong = {
        lat: Number(circuit.Location.lat),
        long: Number(circuit.Location.long)
      }

      // console.log('--marker--')
      // console.log({
      //   lat: latLong.lat,
      //   long: latLong.long,
      //   name: circuit.circuitName,
      //   id: circuit.circuitId
      // })
  
      return <Marker key={i} latitude={latLong.lat} longitude={latLong.long}>
        <Link to={`/F1data/circuits/${circuit.circuitId}`}>
          <div className={'markerInner'}>
            <p id={circuit.circuitId} style={markerLabelStyle}>{circuit.circuitName}</p>
          </div>
        </Link>
      </Marker>
    })
  }

  return <MapGL
    { ...viewPort }
    onViewportChange={(viewPort) => setViewPort(viewPort)}
    mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
    mapStyle="mapbox://styles/mapbox/dark-v9"
  >
    { viewPort.zoom > 4 ? markers : null }

  </MapGL>



}

export default Map