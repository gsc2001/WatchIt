import logo from './logo.svg';
import Test from './components/test';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Route path="/" exact />
            <Route path="/watch/:roomId" exact />
        </BrowserRouter>
    );
}

export default App;
