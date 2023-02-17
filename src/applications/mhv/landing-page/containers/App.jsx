import React from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import LandingPage from '../components/LandingPage';

import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';

const App = () => {
  const { featureToggles, user } = useSelector(state => state);
  const appEnabled = isLandingPageEnabledForUser(
    featureToggles,
    user?.profile?.signIn?.serviceName,
  );

  if (featureToggles.loading || user.profile.loading)
    return <va-loading-indicator />;
  if (!appEnabled) {
    const url = mhvUrl(true, 'home');
    window.location.replace(url);
    return `redirecting to ${url}...`;
  }
  return <LandingPage />;
};

export default App;
