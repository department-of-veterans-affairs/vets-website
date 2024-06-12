import 'platform/polyfills';
import './sass/form-renderer.scss';

import React from 'react';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import formLoadReducer from './reducers/form-load';
import Wrapper from './containers/Wrapper';

startApp({
  url: manifest.rootUrl,
  reducer: formLoadReducer,
  component: <Wrapper />,
});
