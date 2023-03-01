import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import LandingPage from '../components/LandingPage';

import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';
import { resolveLandingPageLinks } from '../utilities/data';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const App = () => {
  const fullState = useSelector(state => state);
  const { featureToggles, user } = fullState;
  const appEnabled = isLandingPageEnabledForUser(
    featureToggles,
    user?.profile?.signIn?.serviceName,
  );
  const data = useMemo(
    () => {
      const authdWithSSOe = isAuthenticatedWithSSOe(fullState) || false;
      return resolveLandingPageLinks(authdWithSSOe, featureToggles);
    },
    [featureToggles, user?.profile?.session?.ssoe],
  );

  if (featureToggles.loading || user.profile.loading)
    return <va-loading-indicator data-testid="loading-indicator" />;
  if (!appEnabled) {
    const url = mhvUrl(true, 'home');
    window.location.replace(url);
    return <></>;
  }
  return <LandingPage data={data} />;
};

export default App;
