import './App.css';
import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import metamaskLogo from './assets/images/metamask.svg';

import pyramid from './assets/images/Pyramid.png'

import MarketplacePage from './components/marketplacePage.js'

function App() {
  const [page, setPage] = useState("marketplace");

  return (
    <div className="App">
      <header className="App-header">
        <logo className="logo-container">
          <img src={pyramid} alt="logo" className="logo"/>
          <div>
            <div>NAPS</div>
            <div className="small-text">Not a pyramid scheme</div>
          </div>
        </logo>
        <menu className="menu">
          <div>Marketplace</div>
          <div>ZZZ DAO</div>
          <div>Your NAPS</div>
        </menu>
      </header>
      <div>
        {page}
        <MarketplacePage />
      </div>
    </div>
  );
}

export default App;
