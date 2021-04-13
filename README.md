### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly - Software Engineering Immersive

# GA Project 2 - Circuit Mapper

##Overview

For the 2nd project at General Assembly, I teamed up with another student to deliver 'Circuit Mapper'. Circuit Mapper is a front end application that displays Formula One data in a fun, interactive way. The project was built in just 2 days, and applies the React Hooks and API skills we had been working on in the weeks prior. Users are able to navigate a map to see various circuits, and then check the details of each circuit to see results at a specific track over the course of a number of years.

You can access the live project [here](https://srosser2.github.io/GA02-F1CircuitMapper/#/F1data/).

![](https://imgur.com/ImzXKmT.jpg)
​
##Brief
​
The app had the following requirements:

* **Consume a public API** – this could be anything, but it must make sense for your project.
* **Have several components**
* **The app should include a router** - with several "pages".
* **Include wireframes** - that you designed before building the app.
* Have **semantically clean HTML** - you make sure you write HTML that makes structural sense rather than thinking about how it might look, which is the job of CSS.
* **Be deployed online** and accessible to the public.


## Technologies Used

- HTML
- CSS
- JavaScript
- React Hooks
- React Router
- Map GL
- Insomnia
- InVision
- Git
- GitHub


##Approach

###Planning

My teammate came up with the concept after discovering the [Ergast API](https://ergast.com/mrd/). We both reviewed the endpoints using the Insomnia API Client to see what kind of data we could get from the API and how we could visualize it in an interesting way. I suggested using InVision to create  wireframes, which made collaborative whiteboarding easy. 

![](https://imgur.com/rxXid2m.png)

Once we had a good idea of the features, we prioritised each feature, and then split the tasks between us. 

For this project, we used the 'Live Share' VS Code extension that allows collaborative coding directly inside another user's text editor. The remote user has to connect to the host's computer, and from there you edit the same files. We had not used Git collaboratively at this point, so this was the easiest and quickest solution to get started. Given the short timeframe of the project, this approach worked fine. 

###Delivery

####The Map Component

My main responsibility in this project was to deliver the map component, the key requirements of which were:

- Display a marker for each circuit at the correct location
- Display the tracks name on the marker
- Search for tracks by the name
- Select a year and display only the circuits for that particular year.

I knew the API had data had a latitude and longitude for each track, and this could be used as input for Map GL.

When tackling this problem I broke the task down into the following steps, and manually tested at each point:

1. Get the API data and save it in state
2. Get the map component to render on the screen
3. Get a marker to appear at a single location on the map using static coordinates
4. Pass API data to make a marker render with the track name
5. Pass all API data to make multiple markers render with track names
6. Add a link to each marker to navigate the user to the correct track
7. Create a text input to filter tracks by name
8. Create a select input to filter tracks by year

Mapbox GL has a few React friendly wrappers, so it was easy to get started. Initially, I used React MapBox GL ([https://www.npmjs.com/package/react-mapbox-gl](https://www.npmjs.com/package/react-mapbox-gl)) for the map component, however after spending some time on working with markers, I found it easier to use a slightly different implementation of the Map GL API from the react-map-gl package ([https://www.npmjs.com/package/react-map-gl](https://www.npmjs.com/package/react-map-gl)). 

```

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

```




####The Table Component

The map detail page contains a table component that displays race results based on the year that the user selects. 

The table takes data as a prop, and a config array representing each column, which allows the table to map the correct data to the correct column for each row of data. This approach made it easy to organize the table and add or remove columns to display easily. 


```
import React, { useEffect, useState } from 'react'

const Table = (props) => {

  const config = [
    {
      header: 'Position',
      dataKey: 'position',
      width: '80px'
    },
    {
      header: 'Driver',
      dataKey: 'driver',
      width: '240px'
    },
    {
      header: 'Constructor',
      dataKey: 'constructor',
      width: '200px'
    }
    // ...
  ] 

  const columns = config.map((column, i) => {
    const style = {
      width: column.width
    }
    return <th className='tablecontents' key={i} style={style}>{column.header}</th>
  })

  const rows = props.data.map((rowData, i) => {
    const cells = Object.keys(rowData) // ['position', 'time']
    const rowCells = cells.map((cell, j) => {

      return <td className='tablecontents' key={j} style={{ borderRadius: '3', backgroundColor: 'white' }}>{rowData[cell]}</td>
    })
    return <tr key={i}>
      {rowCells}
    </tr>
  })



  return <table>
    <thead>
      <tr>
        {columns}
      </tr>
    </thead>
    <tbody>
      {rows}
    </tbody>

  </table>
}

export default Table

```

###Other Contributions

- The card view of tracks
- Styling CSS in the nav bar, map, card view
- Configuring Webpack to use file loader and svg loader.


##Known Bugs

- There is a strange behaviour when searching, where the labels for each track on the map updates to an incorrect track. The user has to zoom out and then back in to see the correct track name at the correct location.
- Due to time constraints, we did not have time to put in the SVG for each track on each page.
- When filtering race results on a specific circuit page, there is an error where the flag can't be matched to a specific driver as the driver data doesn't match the country API data correctly.

##Wins

- This was the first time I had used Map GL and really enjoyed how quick it is to get started with and get good results.
- This was the first project using React Hooks. I have used React with class-based components, so it took some time getting used to doing things with Hooks. 


##Challenges

- The image import method using Webpack made it difficult to import the correct track image to the circuit detail page dynamically. Although we got this to work, we did not have time to change it for all tracks.
- We tried out some component libraries (RSuite), but due to the limited amount of time and learning curve to get things started, we decided to create components ourselves. Given more time to learn the libraries, we would have opted to use something like RSuite or Material UI.

##Key Learnings

- It takes time to learn libraries, and can be easier to implement something yourself if time is limited.

##Future Improvements

- Add the correct track image to each circuit.
- Fix the map functionality so that the correct label shows on the map when the user filters the data via search.
- Add testing to the components.