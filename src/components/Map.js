import React, { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import MapGL, { Marker } from 'react-map-gl'
import markerIcon from '../assets/location-icon.png'
import { Link } from 'react-router-dom'

const Map = (props) => {

  const [viewPort, updateViewPort] = useState(props.config)


  const markerLabelStyle = {
    display: 'block',
    fontSize: '12px'
  }

  let markers = ''

  if (props.data) {
    markers = props.data.map((circuit, i) => {
      const latLong = {
        lat: Number(circuit.Location.lat),
        long: Number(circuit.Location.long)
      }
  
      return <Marker key={i} latitude={latLong.lat} longitude={latLong.long}>
        <Link to={`/circuits/${circuit.circuitId}`}>
          <div className={'markerInner'}>
            <p style={markerLabelStyle}>{circuit.circuitName}</p>
          </div>
        </Link>
      </Marker>
    })
  }

  return <MapGL
    { ...viewPort }
    onViewportChange={(viewPort) => updateViewPort(viewPort)}
    mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
    mapStyle="mapbox://styles/mapbox/dark-v9"
  >
    { viewPort.zoom > 4 ? markers : null }

  </MapGL>



}

export default Map