### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# F1 CIRCUIT MAPPER

## Overview
This was a two day pair project, where we were tasked with picking an existing API and implementing it into our own website. My partner and I decided to go with an F1 motorsports API, as I felt the data provided had lots of potential for great visuals. I utilised the capabilities of a REST API (GET, PUT, POST, DELETE) to create a fully functioning website that visually displayed all historical F1 Grand Prixs and their circuits.

Try it out [here](https://jamesnicholasryan.github.io/F1data/)!

## Brief

* **Consume a public API** – this could be anything but it must make sense for your project.
* **Have several components** - At least one classical and one functional.
* **The app should include a router** - with several "pages".
* **Include wireframes** - that you designed before building the app.
* Have **semantically clean HTML** - you make sure you write HTML that makes structural sense rather than thinking about how it might look, which is the job of CSS.
* **Be deployed online** and accessible to the public.

## Technologies used
- JavaScript
- HTML5
- CSS
- React-MapGL
- Git
- GitHub

# Approach

## Plan
After finding an API that I liked - the F1 data API provided lots of interesting stats which I felt could be visualised in different ways - I went about planning our approach. I decided the focus of the site was going to be on the circuits of the various Gran Prixs. At the forefront of the project was the map component, which would display all the locations of these circuits. The user then has option to select/click on a circuit, where they are then taken to a single circuit page which deisplays even more detailed information about that Gran Prix.

We had 2 days to complete this task. I divided our time/focus on the map component, and the single circuit pages. 


## The Map
The crux of the map page was the interactive map that would allow the user to view all F1 circuits in the API. I also felt it was important to allow them to see the cuircuits in list format too. I intended to add some search functioanlity as well, searching by season/year and circuit name. 

The first task was to 'fetch' the data from the API - something that was important for almost every page of this site. I really enjoyed using this API. It had many features which allowed us to taylor the response to our needs. We could specifc the limit to be 78, allowing us to pull all available circutis. 
```js
useEffect(() => {
  fetch('https://ergast.com/api/f1/circuits.json?limit=78')
    .then((resp) => resp.json())
    .then((data) => {
      setCircuits(data.MRData.CircuitTable.Circuits)
      setFilteredCircuits(data.MRData.CircuitTable.Circuits)
    })
}, [])
```

The API also allowed for various search functionality:
```js
useEffect(() => {
  filterByYear()
}, [filterYear])

function filterByYear(){
  if (filterYear === 'yyyy') {
    return setFilteredCircuits(circuits)
  }
  fetch(`https://ergast.com/api/f1/${filterYear}/circuits.json`)
    .then((resp) => resp.json())
    .then((data) => {
      setFilteredCircuits(data.MRData.CircuitTable.Circuits)
    })
}
```

To toggle between the map or list of cards, I implemented this code. In hindisght, It may be more desirable to write this as a ternary: 
```js
if (showMap) {
  body = <div id={'map-container'}>
    <Map config={mapConfig} data={filteredCircuits}/>
  </div>
} else {
  body = <div className={'card-container'}>
    {filteredCircuits.map((circuit) => {
      return <Card key={circuit.circuitId} circuit={circuit} />
    })}
  </div>
}
```

As mentioned above, the API provided lots of useful information on each circuit. By pulling the latitude and longitude for each circuit, I was able to place these onto the map using React-MapGL's built in marker system:
```js
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
```

## The Circuits
Each marker on the map contained a Link, which would take the user to that specific circuit page. 

Each circuit page has lots of moving parts display various data points and information about the Gran Prix:
- Smaller Map showing the specific location of the circuit
- Flag of the country the circuit is in
- Details, such as name and location
- Circuit layout image
- Season/year filter
- table of results
- Nationality chart

Most of this information was contained within the main F1 API that we were using, however, this API did not contain any info on the flags. I utilised Rest Countries API for that.

Here are some of the fetches made on this page. 
```js
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
```

To display the results data, I decided to use vanilla HTML table. This allowed for a lot of freedom when it came to adding in extra things. For example, I was keen to implentment the flags of each drivers country, and display their position change over the race. Below is how I built the data for the table. I used Material Icons for the position change indicators:
```js
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
      return country.demonym === result.Driver.nationality
    })
    const flag = <img width='30' src={filteredCountry.flag} alt={result.Driver.nationality}></img>
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
```



# Conclusion

## Key Learnings
This was my first opportunity to work on a project that utilised a public API for the main source of content for a website. It was a great opportunity to learn about APIs and how to work with different data types. I found it interesting working out what kind of data the API would return from each request. I quickly learned, that by reading API docs one can plan for these situations, saving a lot of time in development. 

This project was also the first chance I had at applying my new knowledge of the React framework. Once I was pas the initial learning curve, I found the framework to be very efficient at creating SPAs. The framework allows you to create very succinct and neat code, owing to the component aspect of the Reacts file system. 

I implemented a few external libraries for this site, the main one being MapGL. Learning how to integrate these with React had its own learning curve, however, once that hurdle was overcome the potential for creating interesting visuals and an interactive website is exciting.

## Challenges
When fetching the flags from the Rest Countries API I encountered a small issue. I was using the F1 data 'country' value for each circuit, where 'United Kingdom' was listed as 'UK'. The countries API would read the 'UK' query as 'Ukraine' and returned the wrong flag. A similar issue was occuring for 'South Korea'. To ammend this, I hard coded in some checks before sending the request to the countries API. This isn't a perfect solution - somewhat of a 'hack' - however, due to the time constraints it was an ideal work around for the situation:
```js
  let country = circuit.Location.country
  if (country === 'UK') {
    country = 'united kingdom'
  } if (country === 'Korea') {
    country = 'Korea (Republic of)'
  }
```

Throughout the project, I didn't use any CSS frameworks to help with visual fidelity. Although this grants lots of freedom to do some interesting things, because of the nature of the task and the small time frame we had to create it, in hindsight it may have been wise to ustilise a simple framework. 

## Screenshots
![](https://i.imgur.com/8Q2rO07.png)
![](https://i.imgur.com/C6itr2m.png)