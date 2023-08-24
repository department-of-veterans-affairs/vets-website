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
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
} from '../selectors';

const App = () => {
  const { featureToggles, user } = useSelector(state => state);
  const enabled = useSelector(isLandingPageEnabledForUser);
  const vamcEhrData = useSelector(selectVamcEhrData);
  const profile = useSelector(selectProfile);
  const signedIn = useSelector(isLoggedIn);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const useSiS = useSelector(signInServiceEnabled);

  const data = useMemo(
    () => {
      return resolveLandingPageLinks(ssoe, featureToggles);
    },
    [featureToggles, ssoe],
  );

  useDatadogRum();

  const loading =
    vamcEhrData.loading || featureToggles.loading || profile.loading;

  const redirecting = signedIn && !loading && !enabled;

  useEffect(
    () => {
      const redirect = () => {
        const redirectUrl = mhvUrl(ssoe, 'home');
        // console.log({ redirectUrl }); // eslint-disable-line no-console
        window.location.replace(redirectUrl);
      };
      if (redirecting) redirect();
    },
    [ssoe, redirecting],
  );

  if (loading || redirecting)
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="mhv-landing-page-loading"
          message="Please wait..."
        />
      </div>
    );
  return (
    <RequiredLoginView
      useSiS={useSiS}
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <LandingPage data={data} />
    </RequiredLoginView>
  );
};

export default App;
