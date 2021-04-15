import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return <nav className='navBar'>
    <div className={'logo-container'}>
      <Link to={'/F1data/'}><img src='https://i.imgur.com/t0e2Ywi.png' /></Link>
      <Link to={'/F1data/'}><h2>Circuit Mapper</h2></Link>
    </div>
    <div>
      <ul className={'nav-links'}>
        {/* <li>
          <Link to={'/F1data/'} className='navItem'>HOME</Link>
        </li> */}
        <li>
          <Link to={'/F1data/circuits'} className='navItem'>CIRCUITS</Link>
        </li>
      </ul>
    </div>
  </nav>
}

export default Nav