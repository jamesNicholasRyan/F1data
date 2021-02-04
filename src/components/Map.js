import React, { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
// import ReactMapboxGl, { Layer, Feature, Popup, Marker } from 'react-mapbox-gl'
import MapGL, { Marker } from 'react-map-gl'
import markerIcon from '../assets/location-icon.png'
import { Link } from 'react-router-dom'

const Map = (props) => {

  const [viewPort, updateViewPort] = useState({
    height: '100vh',
    width: '100vw',
    zoom: 4.5,
    latitude: 51.515,
    longitude: -0.078
  })


  const markerLabelStyle = {
    display: 'block',
    fontSize: '12px'
  }

  const markers = props.data.map((circuit, i) => {
    
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

  return <MapGL
    { ...viewPort }
    onViewportChange={(viewPort) => updateViewPort(viewPort)}
    mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
  >
    { viewPort.zoom > 4 ? markers : null }

  </MapGL>



}

export default Map