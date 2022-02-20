import { Button } from 'react-bootstrap';

function Dao(props) {

  function buyLevel1() {
    console.log("buyTierOne")
    props.napsContract.methods.mintTopLevelNFT(props.address, "art.art/wp-content/uploads/2021/09/circa.art_.jpg").send(
      {
        from: props.address,
        value: 250000000000000000
      }
    );
  }

  console.log(props.account)
  console.log(props.napsContract)

  return (
    <div className="dao">
        <h2>Gyza DAO</h2>
        <Button variant="primary" onClick={() => buyLevel1()}>Mint Layer 1</Button>
    </div>
  );
}

export default Dao;