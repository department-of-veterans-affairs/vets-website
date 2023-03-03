import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LandingPage from '../components/LandingPage';

import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';
import { resolveLandingPageLinks } from '../utilities/data';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';

const App = () => {
  const fullState = useSelector(state => state);
  const { featureToggles, user } = fullState;

  const data = useMemo(
    () => {
      const authdWithSSOe = isAuthenticatedWithSSOe(fullState) || false;
      return resolveLandingPageLinks(authdWithSSOe, featureToggles);
    },
    [featureToggles, user?.profile?.session?.ssoe],
  );
  const isCernerPatient = selectIsCernerPatient(fullState || {});

  const appEnabled = useMemo(
    () => {
      return (
        isLandingPageEnabledForUser(
          featureToggles,
          user?.profile?.signIn?.serviceName,
        ) &&
        user?.login?.currentlyLoggedIn &&
        !isCernerPatient
      );
    },
    [
      featureToggles,
      isCernerPatient,
      user?.login?.currentlyLoggedIn,
      user?.profile?.signIn?.serviceName,
    ],
  );

  if (featureToggles.loading || user.profile.loading)
    return <va-loading-indicator />;
  if (!appEnabled) {
    const url = mhvUrl(true, 'home');
    window.location.replace(url);
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
