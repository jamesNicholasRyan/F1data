import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [backgroundImage, setBackgroundImage] = useState('')

  useState(() => {
    const imageArray = ['https://images.unsplash.com/photo-1505739776745-f1a6bf1f5246?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1590214074323-fd5649874bee?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1545313602-3e64ef9d8ee7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 
        'https://images.unsplash.com/photo-1537029271773-31e5422be11c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80',
      ]
    const randomImg = Math.floor(Math.random() * imageArray.length)
    console.log(randomImg)
    setBackgroundImage(imageArray[randomImg])
  }, [])
  
  return <div>
      <img className='home-image' src={backgroundImage}></img>
      <Link to={'/F1data/circuits'} className='welcome-message'>Start discovering...</Link>
    </div>
}

export default Home