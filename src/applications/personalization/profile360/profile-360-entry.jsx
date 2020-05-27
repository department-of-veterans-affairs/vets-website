import './sass/profile-360.scss';
import 'applications/personalization/profile-2/sass/profile-2.scss';
import 'platform/polyfills';
import React from 'react';
import ProfilesWrapper from 'applications/personalization/profiles-wrapper/ProfilesWrapper.jsx';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';
import profileUi from 'applications/personalization/profile-2/reducers';

startApp({
  component: <ProfilesWrapper />,
  entryName: manifest.entryName,
  reducer: { ...reducer, profileUi },
  url: manifest.rootUrl,
});
