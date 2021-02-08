import React, { useEffect, useState } from 'react'
import { BrowserRouter, HashRouter, Switch, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Nav from './components/Nav'
import Circuits from './components/Circuits'
import Circuit from './components/Circuit'

import './styles/style.scss'

const App = () => (
  <HashRouter>
    <Nav />
    <Switch>
      <Route exact path="/F1data/circuits/:id" component={Circuit}/>
      <Route exact path="/F1data/circuits" component={Circuits}/>
      <Route exact path="/F1data/" component={Home}/>
    </Switch>
  </HashRouter>
)

// http://localhost:8000/circuits/circuit?id=anderstorp?year=2016


export default App