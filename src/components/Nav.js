import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return <nav className='navBar'>
    <div className={'logo-container'}>
      <img src='https://i.imgur.com/t0e2Ywi.png' />
    </div>
    <div>
      <ul className={'nav-links'}>
        <li>
          <Link to={'/'} className='navItem'>HOME</Link>
        </li>
        <li>
          <Link to={'/circuits'} className='navItem'>CIRCUITS</Link>
        </li>
      </ul>
    </div>
  </nav>
}

export default Nav