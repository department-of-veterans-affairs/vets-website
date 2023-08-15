import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LandingPage from '../components/LandingPage';
import { resolveLandingPageLinks } from '../utilities/data';
import { useDatadogRum } from '../hooks/useDatadogRum';
import {
  isAuthenticatedWithSSOe,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectDrupalStaticData,
  selectProfile,
} from '../selectors';

const App = () => {
  const appEnabled = useSelector(isLandingPageEnabledForUser);
  const drupalStaticData = useSelector(selectDrupalStaticData);
  const profile = useSelector(selectProfile);
  const signedIn = useSelector(isLoggedIn);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const fullState = useSelector(state => state);
  const { featureToggles, user } = fullState;

  const data = useMemo(
    () => {
      return resolveLandingPageLinks(ssoe, featureToggles);
    },
    [featureToggles, ssoe],
  );

  useDatadogRum();

  const loading =
    drupalStaticData?.vamcEhrData?.loading ||
    featureToggles.loading ||
    profile.loading;

  useEffect(
    () => {
      const redirect = () => {
        const redirectUrl = mhvUrl(ssoe, 'home');
        // console.log({ redirectUrl });
        window.location.replace(redirectUrl);
      };
      if (signedIn && !loading && !appEnabled) redirect();
    },
    [appEnabled, loading, signedIn, ssoe],
  );

  if (!signedIn) return <RequiredLoginView user={user} />;
  if (loading)
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator message="Please wait..." />
      </div>
    );
  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <LandingPage data={data} />
    </RequiredLoginView>
  );
};

export default App;
