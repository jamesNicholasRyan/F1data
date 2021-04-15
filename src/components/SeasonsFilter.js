import React from 'react'

const SeasonsFilter = ({ seasons, clickHandler }) => {
  return (
    <div className={'seasons-filter-container'}>
      <ul>
        <li onClick={() => clickHandler('yyyy')}>All Seasons</li>
        {seasons.map((season) => {
          return <li onClick={() => clickHandler(season)} key={season}>{season}</li>
        })}
      </ul>
    </div>
  )
}

export default SeasonsFilter