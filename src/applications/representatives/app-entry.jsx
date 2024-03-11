import * as React from 'react';
import '@department-of-veterans-affairs/platform-polyfills';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';

import './sass/representatives.scss';
import App from './App';

startReactApp(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
