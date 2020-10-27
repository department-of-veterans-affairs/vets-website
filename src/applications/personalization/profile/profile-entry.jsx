import './sass/profile-360.scss';
import 'applications/personalization/profile/sass/profile.scss';
import 'platform/polyfills';
import React from 'react';
import ProfileRouter from 'applications/personalization/profile/components/ProfileRouter';
import connectedApps from 'applications/personalization/profile/components/connected-apps/reducers/connectedApps';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';

startApp({
  component: <ProfileRouter />,
  entryName: manifest.entryName,
  reducer: { ...reducer, connectedApps },
  url: manifest.rootUrl,
});
