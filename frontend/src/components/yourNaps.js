import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/marketplacePage.css";

function YourNaps(props) {
  const [yourNaps, setYourNaps] = useState([]);

  useEffect(() => {
    if(props.address && props.napsContract) {
      props.napsContract.methods.getUserNaps(props.address).call(
        {
          from: props.address,
        }, (err, res) => {
          if (!err) {
            console.log(res);
          } else {
            console.log(err);
          }
        })

      console.log("yourNaps");
      let napsFakeData = [];
      for (let i = 0; i < 4; i++) {
        napsFakeData.push({
          id: i,
          level: 3,
          price: "0.06 ETH",
          img: "https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg",
        });
      }
      setYourNaps(napsFakeData);
    }
  }, [props.address]);

  function renderCards() {
    const listItems = yourNaps.map((d) => (
      <Card className="card" key={d.id}>
        <Card.Img
          variant="top"
          src="https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg"
        />
        <Card.Body>
          <Card.Title>NAP {d.id}</Card.Title>
          <Card.Text>
            Level: {d.level}
            <br></br>
            Price: {d.price}
          </Card.Text>
          <Link to={`/nap/${d.id}`}>
            <Button variant="primary">See More</Button>
          </Link>
        </Card.Body>
      </Card>
    ));

    return <div className="napList">{listItems}</div>;
  }

  return (
    <div className="MarketplacePage">
      <div>
        <h2>Your Naps</h2>
        <p>Here you can see your NAPS</p>
      </div>
      {renderCards()}
    </div>
  );
}

export default YourNaps;
