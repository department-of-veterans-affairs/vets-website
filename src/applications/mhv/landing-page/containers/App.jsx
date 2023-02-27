import React from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LandingPage from '../components/LandingPage';

import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';

const App = () => {
  const { featureToggles, user } = useSelector(state => state);
  const appEnabled = isLandingPageEnabledForUser(
    featureToggles,
    user?.profile?.signIn?.serviceName,
  );
  if (featureToggles.loading || user.profile.loading)
    return <va-loading-indicator data-testid="loading-indicator" />;
  if (!appEnabled && user.login.currentlyLoggedIn) {
    const url = mhvUrl(true, 'home');
    window.location.replace(url);
    return <></>;
  }
  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <LandingPage />
    </RequiredLoginView>
  );
};

export default App;
