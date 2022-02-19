import './App.css';
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Nav } from 'react-bootstrap';

import pyramid from './assets/images/Pyramid.png'

import MarketplacePage from './components/marketplacePage.js'

function App() {
  const [page, setPage] = useState("marketplace");

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={pyramid} alt="logo" className="logo"/>
          <div>
            <div>NAPS</div>
            <div className="small-text">Not a pyramid scheme</div>
          </div>
        </div>
        <menu className="menu">
          <Nav
            activeKey="/Marketplace"
            onSelect={(selectedKey) => {setPage(selectedKey)}}
          >
            <Nav.Item>
            <Nav.Link eventKey="MarketPlace">Marketplace</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dao">Gyza Dao</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="yourNaps">Your Naps</Nav.Link>
            </Nav.Item>
          </Nav>
        </menu>
      </header>
      <div className="main-body">
        {page}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MarketplacePage />} />
            <Route path="Marketplace" element={<MarketplacePage />} />
            <Route path=":nap" element={<MarketplacePage />} />
          </Routes>
        </BrowserRouter>,

        
      </div>
    </div>
  );
}

export default App;
