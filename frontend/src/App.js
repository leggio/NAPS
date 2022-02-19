import './App.css';
import { Button } from 'react-bootstrap';
import metamaskLogo from './assets/images/metamask.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button variant="secondary">
          <img src={metamaskLogo}/>
        </Button>  
        <p>Hello world</p>
      </header>
    </div>
  );
}

export default App;
