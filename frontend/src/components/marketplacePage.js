import React, { useEffect, useState } from "react";
import { Card, Button } from 'react-bootstrap';


import '../styles/marketplacePage.css';

function MarketplacePage() {
    const [napsForSale, setNapsForSale] = useState([]);

    useEffect(() => {    
        if(napsForSale.length === 0) {
            console.log("naps for sale")
            let napsFakeData = []
            for (let i = 0; i < 10; i++) {
                napsFakeData.push(
                    {
                        id: i,
                        level: 3,
                        price: "0.06 ETH",
                        img: "https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg"
                    }
                );  
            } 
            setNapsForSale(napsFakeData) 
        }
    }, [napsForSale]);

    function renderCards() {
        const listItems = napsForSale.map(
            (d) =>
            <Card className="card" key={d.id}>
                <Card.Img variant="top" src= "https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg"/>
                <Card.Body>
                    <Card.Title>NAP {d.id}</Card.Title>
                    <Card.Text>
                        Level: {d.level}
                        <br></br>
                        Price: {d.price}
                    </Card.Text>
                    <Button variant="primary">See More</Button>
                </Card.Body>
            </Card>            
        );

        return (
        <div className="napList">
            {listItems}
        </div>
        );
    }

    return (
        <div className="MarketplacePage">
            <div>
                <h2>Marketplace</h2>
                <p>Here you can buy NFTs from other NAP owners</p>
            </div>
            {renderCards()}
        </div>
    );
}

export default MarketplacePage;