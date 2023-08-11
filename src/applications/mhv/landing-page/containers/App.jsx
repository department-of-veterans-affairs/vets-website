import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import { resolveLandingPageLinks } from '../utilities/data';
import {
  selectProfile,
  selectVamcEhrData,
  isAppEnabled,
  isAuthenticatedWithSSOe,
} from '../selectors';
import { useDatadogRum } from '../hooks/useDatadogRum';
import LandingPage from '../components/LandingPage';

const requiredServices = [
  backendServices.USER_PROFILE,
  // backendServices.VA_PROFILE,
];

const App = () => {
  const enabled = useSelector(state => isAppEnabled(state));
  const profile = useSelector(state => selectProfile(state));
  const ssoe = useSelector(state => isAuthenticatedWithSSOe(state));
  const vamcEhrData = useSelector(state => selectVamcEhrData(state));
  const { featureToggles, user } = useSelector(state => state);

  const data = useMemo(() => resolveLandingPageLinks(ssoe, featureToggles), [
    featureToggles,
    ssoe,
  ]);

  useDatadogRum();

  const loading =
    featureToggles.loading || profile.loading || vamcEhrData.loading;
  if (loading) return <va-loading-indicator />;
  if (!loading && !enabled) {
    const redirectUrl = mhvUrl(ssoe, 'home');
    window.location.replace(redirectUrl);
    return <></>;
  }
  return (
    <RequiredLoginView useSiS user={user} serviceRequired={requiredServices}>
      <LandingPage data={data} />;
    </RequiredLoginView>
  );
};

export default App;
