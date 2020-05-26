import React from 'react';
import 'platform/polyfills';
import './sass/debt-letters.scss';
import DebtLettersWrapper from './components/DebtLettersWrapper';

import startApp from '../../platform/startup';

import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  component: <DebtLettersWrapper />,
  reducer,
  entryName: manifest.entryName,
});
