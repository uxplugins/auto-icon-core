import logo from './logo.svg';
import './App.css';
import { ImHome } from './npm-exports/react-package/im';
// import { ImHome } from 'react-icons/im';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ImHome style={{ width: 500, height: 400, fill: 'red' }} onClick={() => alert('hi')} className="App-logo" />

      </header>
    </div>
  );
}

export default App;
