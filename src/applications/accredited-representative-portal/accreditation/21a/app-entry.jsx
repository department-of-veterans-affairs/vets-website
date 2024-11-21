import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import App from './containers/App';
import manifest from './manifest.json';

// TODO: Update the basename value to the correct path
const customHistory = createBrowserHistory({ basename: '/' });

startReactApp(
  <Router history={customHistory}>
    <App />
  </Router>,
  { entryName: manifest.entryName },
);
