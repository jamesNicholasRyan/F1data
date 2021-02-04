import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return <nav>
      <ul className='navBar'>
      <li>
        <Link to={'/'} className='navItem'>HOME</Link>
      </li>
      <li>
        <Link to={'/circuits'} className='navItem'>CIRCUITS</Link>
      </li>
    </ul>
  </nav>
}

export default Nav