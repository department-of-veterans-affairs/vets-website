import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LandingPage from '../components/LandingPage';

import { resolveLandingPageLinks } from '../utilities/data';

import { useDatadogRum } from '../hooks/useDatadogRum';
import {
  isAuthenticatedWithSSOe,
  isLandingPageEnabled,
  isLoggedIn,
  selectDrupalStaticData,
  selectProfile,
} from '../selectors';

const App = () => {
  const appEnabled = useSelector(isLandingPageEnabled);
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

  if (!signedIn) return <RequiredLoginView user={user} />;
  const loading =
    drupalStaticData?.vamcEhrData?.loading ||
    featureToggles.loading ||
    profile.loading;
  if (loading) return <va-loading-indicator />;
  if (!appEnabled) {
    const redirectUrl = mhvUrl(ssoe, 'home');
    // console.log({ redirectUrl });
    window.location.replace(redirectUrl);
    return <></>;
  }
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
