import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/marketplacePage.css";

function MarketplacePage(props) {
  const [napsDetailed, setNapsDetailed] = useState([]);

  useEffect(() => {
    console.log("props")
    console.log(props)

    let allNaps;
    let napsDetailed = []
    if(Object.keys(props.address).length !== 0 && Object.keys(props.napsContract).length !== 0) {
      props.napsContract.methods.getAllNaps().call(
        {
          from: props.address
        }, async (err, res) => {
          if (!err) {
            allNaps = res;
            console.log(allNaps);
            for (let i = 0; i < allNaps; i++) {
              const nap = await new Promise((resolve, reject) => {
                props.napsContract.methods.getNapDetails(parseInt(i)).call(
                  {
                    from: props.address,
                  }, (err, res) => {
                    if (!err) {
                      console.log(res);
                      resolve({
                        id: res[4],
                        level: res[1],
                        forSale: res[2],
                        price: res[3],
                        children: res[5],
                        owner: res[7],
                        img: "https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg" 
                      })
                    } else {
                      console.log(err)
                    }
                  }
                )
              })
              napsDetailed.push(nap);
              console.log(nap);
            }
            setNapsDetailed(napsDetailed);
          } else {
            console.log(err)
          }
        }
      )
    }
  }, [props.address]);

  function renderCards() {
    console.log(napsDetailed);
    const listItems = napsDetailed.map((d) => (
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
          <Link to={`/nap/${d.id}`} state={{napInfo: d}}>
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
        <h2>Marketplace</h2>
        <p>Here you can buy NFTs from other NAP owners</p>
      </div>
      {renderCards()}
    </div>
  );
}

export default MarketplacePage;
