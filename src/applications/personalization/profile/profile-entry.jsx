import '@@profile/sass/profile.scss';
import '../common/components/devtools/sass/DevTools.scss';
import '~/platform/polyfills';
import React, { StrictMode } from 'react';
import Profile from '@@profile/components/Profile';
import connectedApps from '@@profile/components/connected-apps/reducers/connectedApps';
import startApp from '~/platform/startup/router';
import manifest from './manifest.json';
import reducer from './reducers';

const App = () => (
  <StrictMode>
    <Profile />
  </StrictMode>
);

startApp({
  component: <App />,
  entryName: manifest.entryName,
  reducer: { ...reducer, connectedApps },
  url: manifest.rootUrl,
});
