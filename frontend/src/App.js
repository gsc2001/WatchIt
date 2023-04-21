import logo from './logo.svg';
import './App.css';
import Test from './components/test';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

function App() {

    return (
        <div className="App">
            <Test />
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>sr.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
