import './index.css';

import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './components/App';
import { Home } from './components/Home';
import { TopBar } from './components/TopBar/TopBar';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';

const Debug = lazy(() => import('./components/Debug/Debug'));

// const firebaseConfig = process.env.REACT_APP_FIREBASE_CONFIG;
// if (firebaseConfig) {
//   firebase.initializeApp(JSON.parse(firebaseConfig));
// }

// Redirect old-style URLs
if (window.location.hash) {
  const hashRoomId = window.location.hash.substring(1);
  window.location.href = '/watch/' + hashRoomId;
}

class WatchParty extends React.Component {
  public state = {
    // user: undefined as firebase.User | undefined,
    isSubscriber: false,
    isCustomer: false,
    streamPath: undefined as string | undefined,
    beta: false,
  };

  render() {
    return (
      // <React.StrictMode>
      <BrowserRouter>
        <Route
          path="/"
          exact
          render={(props) => {
            return (
              <React.Fragment>
                <TopBar
                  // user={this.state.user}
                  hideNewRoom
                />
                <Home />
              </React.Fragment>
            );
          }}
        />
        <Route
          path="/watch/:roomId"
          exact
          render={(props) => {
            return (
              <App
                urlRoomId={props.match.params.roomId}
                streamPath={this.state.streamPath}
                beta={this.state.beta}
              />
            );
          }}
        />
        <Route
          path="/r/:vanity"
          exact
          render={(props) => {
            return (
              <App
                vanity={props.match.params.vanity}
                streamPath={this.state.streamPath}
                beta={this.state.beta}
              />
            );
          }}
        />

        <Route path="/debug">
          <TopBar />
          <Suspense fallback={null}>
            <Debug />
          </Suspense>
        </Route>
      </BrowserRouter>
      // </React.StrictMode>
    );
  }
}
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<WatchParty />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
