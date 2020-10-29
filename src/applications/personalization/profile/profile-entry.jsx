import '@@profile/sass/profile.scss';
import 'platform/polyfills';
import React from 'react';
import Profile from '@@profile/components/Profile';
import connectedApps from '@@profile/components/connected-apps/reducers/connectedApps';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';

startApp({
  component: <Profile />,
  entryName: manifest.entryName,
  reducer: { ...reducer, connectedApps },
  url: manifest.rootUrl,
});
