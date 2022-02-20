import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/marketplacePage.css";

function YourNaps(props) {
  const [yourNaps, setYourNaps] = useState([]);
  const [listItems, setListItems] = useState();

  useEffect(() => {
    if(Object.keys(props.address).length !== 0 && Object.keys(props.napsContract).length !== 0) {
      props.napsContract.methods.getUserNaps(props.address).call(
        {
          from: props.address,
        }, async (err, res) => {
          if (!err) {
            console.log(res);

            let tempNaps = []
            for (let i = 0; i < res.length; i++) {
                const nap = await new Promise((resolve, reject) => {
                  console.log(res[i])
                  props.napsContract.methods.getNapDetails(parseInt(res[i])).call(
                    {
                      from: props.address,
                    }, (err, res) => {
                      if (!err) {
                        resolve({
                          id: res[4],
                          level: res[1],
                          price: res[3],
                          img: "https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg"
                        })
                      } else {
                        console.log(err)
                      }
                    })
                })

                tempNaps.push(nap)
                console.log(nap)
            }
            console.log(tempNaps)
            setYourNaps(tempNaps)

          } else {
            console.log(err);
          }
        })
    }
  }, [props.address]);

  useEffect(() => {
    console.log("yourNaps Updated")
    console.log(yourNaps)
  }, [yourNaps]);

  function renderCards() {
    console.log(yourNaps)
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