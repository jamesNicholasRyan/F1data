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
    },
    {
      header: 'Time',
      dataKey: 'time',
      width: '80px'
    },
    {
      header: 'Grid',
      dataKey: 'grid',
      width: '80px'
    },
    {
      header: 'Position Change',
      dataKey: 'positionChange',      
      width: '30px',
    },
    {
      header: '',
      dataKey: 'changeArrow',      
      width: '5px',
      // color: 'color',
    },
    {
      header: 'Nationality',
      dataKey: 'fastestLap'
    },
    {
      header: '',
      dataKey: ''
    },
  ] 

  const columns = config.map((column, i) => {
    const style = {
      width: column.width
    }
    return <th className='tablecontents' key={i} style={style}>{column.header}</th>
  })

  const rows = props.data.map(rowData => {
    const cells = Object.keys(rowData) // ['position', 'time']
    const rowCells = cells.map((cell, i) => {

      return <td className='tablecontents' key={i} style={{ borderRadius: '3', backgroundColor: 'white' }}>{rowData[cell]}</td>
    })
    return <tr>
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