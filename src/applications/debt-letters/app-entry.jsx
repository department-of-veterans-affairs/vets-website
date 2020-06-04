import React from 'react';
import 'platform/polyfills';
import './sass/debt-letters.scss';
import DebtLettersLanding from './components/DebtLettersLanding';
import routes from './routes';

import startApp from 'platform/startup';

import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  component: <DebtLettersLanding />,
  reducer,
  routes,
  entryName: manifest.entryName,
});
