import './sass/profile-360.scss';
import 'applications/personalization/profile/sass/profile.scss';
import 'platform/polyfills';
import React from 'react';
import ProfileWrapper from 'applications/personalization/profile-wrapper/ProfileWrapper.jsx';
import connectedApps from 'applications/personalization/profile/components/connected-apps/reducers/connectedApps';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';

startApp({
  component: <ProfileWrapper />,
  entryName: manifest.entryName,
  reducer: { ...reducer, connectedApps },
  url: manifest.rootUrl,
});
