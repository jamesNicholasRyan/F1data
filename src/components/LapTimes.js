import React, { useEffect, useState } from 'react'
import { Hint, LineMarkSeries, XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis'

const LapTimes = (props) => {
  const [lineData, setLineData] = useState([])
  const [positionX, updateX] = useState(0)
  const [positionY, updateY] = useState(0)
  const [isTooltipShown, updateTooltip] = useState(false)
  const [driverName, setDriverName] = useState('')
  const [mouseX, setMouseX] = useState('')
  const [mouseY, setMouseY] = useState('')
  const [hoveredPoint, setHoveredPoint] = useState({
    x: Number,
    y: Number
  })
  let counterR = "255"
  let counterG = "190"
  let counterB = "0"

  function findDataLimits() {
    const lapData = lineData.map((driver) => {
      return driver.lapTimes.map((lap) => {
        return (({ y }) => ({ y }))(lap)
      })
    }) 
    const merged = [].concat.apply([], lapData)
    const yData = merged.map((lap) => {
      return Object.values(lap)
    })
    const merged2 = [].concat.apply([], yData)
    const min = Math.min(...merged2)
    const max = Math.max(...merged2)
    return [max, min]
  }

  useEffect(() => {
    setLineData(props.data)
  }, [props.data])

  function toggleToolTip(dataPoint, e, driver) {
    updateTooltip(!isTooltipShown)
    const x = dataPoint.x
    const y = dataPoint.y
    updateX(x)
    updateY(y)
    setDriverName(driver)
    setHoveredPoint({
      x: dataPoint.x,
      y: dataPoint.y
    })
  }

  function convertTime(time) {
    const split = String(time).split('.')
    const minutes = Math.floor(split[0]/60)
    let seconds = Number
    if (minutes < 2) {
      seconds = split[0] - 60
    } else {
      seconds = split[0] - 120
    }
    const milliseconds = split[1]
    return `${minutes}:${seconds}.${milliseconds}`
  }

  return <div>
    <XYPlot 
      width={800} 
      height={600}
      yDomain={findDataLimits()} 
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis title="Laps" />
      <YAxis title="Lap Time" />

      {lineData.map((driver, index) => {
        const lapTimes = driver['lapTimes']
        counterR = String(parseInt(counterR)-10)
        counterG = String(parseInt(counterG)-10)
          return <LineMarkSeries
            key={index}
            data={lapTimes}
            color={`rgb(${counterR},${counterG},${counterB})`}
            onValueMouseOut={(datapoint, event) => toggleToolTip(datapoint)}
            onValueMouseOver={(dataPoint, event) => toggleToolTip(dataPoint, event, driver.driver)}
          />
        })
      }
      {isTooltipShown && <Hint 
        value={hoveredPoint}
        style={
          {
            fontSize: '20px',
            backgroundColor: 'rgb(0,20,50)',
            borderRadius: '5px',
            width: '170px',
            height: '50px',
            textAlign: 'center',
            padding: '5px'
          }
        }
      >
        <div>{driverName}</div>
        <div>{convertTime(positionY)}</div>
      </Hint>}
    </XYPlot>
  </div>
}

export default LapTimes