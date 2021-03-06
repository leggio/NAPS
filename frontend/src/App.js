import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Web3 from "web3";

import pyramid from "./assets/images/Pyramid.png";

import MarketplacePage from "./components/marketplacePage.js";
import Nap from "./components/nap.js";
import Dao from "./components/dao.js";
import YourNaps from "./components/yourNaps.js";

import NAPSABI from "./contract_data/totallyNAPS.json";
import addresses from "./contract_data/dev.json";

function App() {
  let account = "0xDEADBEEF";

  const { ethereum } = window;

  const [napsContract, setNapsContract] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [address, setAddress] = useState(undefined);

  useEffect(() => {
    ethereum.request({ method: "eth_requestAccounts" });
    let web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
    setWeb3(web3);
    setNapsContract(new web3.eth.Contract(NAPSABI, addresses.naps));
  }, []);

  useEffect(() => {
    async function fetchAddress() {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAddress(account);
    }

    fetchAddress();
  }, []);

  if(address === undefined || napsContract === undefined) {
    console.log("address not yet loaded")
    return (
      <div className="App"></div>
    )
  } else {
    console.log(address)
    console.log(napsContract)
    return (
      <div className="App">
        <BrowserRouter>
          <header className="App-header">
            <div className="logo-container">
              <img src={pyramid} alt="logo" className="logo" />
              <div>
                <div>NAPS</div>
                <div className="small-text">Not a pyramid scheme</div>
              </div>
            </div>
            <menu className="menu">
              <Nav activeKey="/dao">
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
              <Route 
                path="/" 
                element={
                  <MarketplacePage
                    napsContract={napsContract}
                    address={address}
                  />}
              />
              <Route
                path="Marketplace"
                element={
                  <MarketplacePage
                    napsContract={napsContract}
                    address={address}
                  />
                }
              />
              <Route
                path="dao"
                element={<Dao napsContract={napsContract} address={address} />}
              />
              <Route 
              path="/nap/:id" 
              element={<Nap napsContract={napsContract} address={address} id={(p) => p.id} /> } />
              <Route
                path="/yourNaps"
                element={
                  <YourNaps napsContract={napsContract} address={address} />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
