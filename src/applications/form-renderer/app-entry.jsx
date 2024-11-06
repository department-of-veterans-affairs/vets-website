import 'platform/polyfills';
import './sass/form-renderer.scss';

import React from 'react';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';
import App from './containers/App';

startApp({
  url: manifest.rootUrl,
  reducer,
  component: <App />,
});
