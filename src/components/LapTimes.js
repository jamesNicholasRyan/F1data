import React, { useEffect, useState } from 'react'
import { LineMarkSeries, XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis'

const LapTimes = (props) => {
  const [lineData, setLineData] = useState([])
  // console.log(props.data)
  useEffect(() => {
    console.log('setting data')
    setLineData(props.data)
  }, [props.data])

  console.log(lineData)

  return <div>
    <XYPlot width={800} height={800}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis title="Laps" />
      <YAxis title="Lap Time" />

      {lineData.map((driver, index) => {
          return <LineMarkSeries
            key={index}
            data={driver['lapTimes']}
          />
        })
      }
    </XYPlot>
  </div>
}

export default LapTimes