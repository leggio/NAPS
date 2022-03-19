import "../styles/naps.css";

import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

import Tree from "./tree.js";
import Triangle from "./triangle.js";

import { useParams, useLocation } from "react-router-dom";

function Nap(props) {
  function listNFT(id, listPrice) {
    console.log("listNFT");
    console.log(props.napsContract);
    props.napsContract.methods.listNFT(id, listPrice).send(
      {
        from: props.address,
      },
      (err, res) => {
        if (!err) {
          console.log("woo!");
        } else {
          console.log(err);
        }
      }
    );
  }

  function unlistNFT(id) {
    console.log("unlistNFT");
    console.log(props.napsContract);
    props.napsContract.methods.unlistNFT(id).send(
      {
        from: props.address,
      },
      (err, res) => {
        if (!err) {
          console.log("woo!");
        } else {
          console.log(err);
        }
      }
    );
  }

  const { id } = useParams();
  const [nap, setNap] = useState({});
  const [napsTree, setNapsTree] = useState([]);
  const location = useLocation();
  const { napInfo } = location.state;

  console.log("napInfo");
  console.log(napInfo);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      See NAP
    </Tooltip>
  );

  useEffect(() => {
    setNap({
      id: napInfo.id,
      owner: napInfo.owner,
      forSale: napInfo.forSale,
      level: napInfo.level,
      children: napInfo.children,
      price: "0.06 ETH",
      img: "https://ih1.redbubble.net/image.630419865.4942/bg,f8f8f8-flat,750x,075,f-pad,1000x1000,f8f8f8.jpg",
    });

    setNapsTree(["100", "1000", "1001"]);
  }, [napInfo]);

  if (Object.keys(nap).length === 0) {
    return <div />;
  } else {
    return (
      <div className="napPage">
        <div className="column">
          <Triangle />
          {/* <img src={nap.img} alt="nap image" className="napPageImg" /> */}
        </div>
        <div className="column">
          <h2>Nap #: {napInfo.id}</h2>
          <div className="subInfo">
            <p>Level: {napInfo.level}</p>
            <p>Owner: {napInfo.owner}</p>
          </div>
          <div>
            <Button variant="primary" onClick={() => listNFT(nap.id, 500)}>
              List NAP
            </Button>
            <Button variant="primary" onClick={() => unlistNFT(nap.id)}>
              Unlist NAP
            </Button>
          </div>

          <div className="treeSection">
            <h4>Family Tree</h4>
            <div className="oneNodeRow">
              <div class="node">
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 200 }}
                  overlay={renderTooltip}
                >
                  <div style={{ height: "100%" }}>{nap.id.slice(0, -1)}</div>
                </OverlayTrigger>
              </div>
            </div>
            <Tree decentants={napsTree} node={nap.id} level={0} />
          </div>
        </div>
      </div>
    );
  }
}

export default Nap;
