import { Button } from 'react-bootstrap';
import {
  useParams
} from "react-router-dom";

function Nap(props) {
  const { id } = useParams();

  return (
    <div className="napPage">
        Nap page
        {id}
    </div>
  );
}

export default Nap;