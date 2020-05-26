import React from 'react';
import 'platform/polyfills';
import './sass/debt-letters.scss';

import startApp from '../../platform/startup';

import reducer from './reducers';
import manifest from './manifest';

startApp({
  url: manifest.rootUrl,
  component: () => <h1>Foo</h1>,
  reducer,
  entryName: manifest.entryName,
});
