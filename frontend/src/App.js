import './App.css';
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useMetaMask } from "metamask-react";

import pyramid from './assets/images/Pyramid.png'

import MarketplacePage from './components/marketplacePage.js'
import Nap from './components/nap.js'
import Dao from './components/dao.js'

function App() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  useEffect(() => {
    connect()
  }, []);
 

  return (
    <div className="App">
      <BrowserRouter>
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
            >
              <Nav.Item>
                <LinkContainer to={`/Marketplace`}>
                  <Nav.Link>Marketplace</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to={`/dao`}>
                  <Nav.Link eventKey="dao">Gyza Dao</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to={`/yourNaps`}>
                  <Nav.Link eventKey="yourNaps">Your Naps</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            </Nav>
          </menu>
        </header>
        <div className="main-body">
            <Routes>
              <Route path="/" element={<MarketplacePage />} />
              <Route path="Marketplace" element={<MarketplacePage />} />
              <Route path="dao" element={<Dao />} />
              <Route path="/nap/:id" element={<Nap id={p => p.id} />} />
            </Routes>          
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
