/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LandingPage from '../components/LandingPage';
import {
  resolveLandingPageLinks,
  countUnreadMessages,
  resolveUnreadMessageAriaLabel,
} from '../utilities/data';
import { useDatadogRum } from '../hooks/useDatadogRum';
import {
  isAuthenticatedWithSSOe,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
  hasHealthData,
} from '../selectors';
import { getFolderList } from '../utilities/api';

const App = () => {
  const { featureToggles, user } = useSelector(state => state);
  const [unreadMessageCount, setUnreadMessageCount] = useState();
  const enabled = useSelector(isLandingPageEnabledForUser);
  const vamcEhrData = useSelector(selectVamcEhrData);
  const profile = useSelector(selectProfile);
  const signedIn = useSelector(isLoggedIn);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const useSiS = useSelector(signInServiceEnabled);
  const userHasHealthData = useSelector(hasHealthData);
  const unreadMessageAriaLabel = resolveUnreadMessageAriaLabel(
    unreadMessageCount,
  );

  const data = useMemo(
    () => {
      return resolveLandingPageLinks(
        ssoe,
        featureToggles,
        unreadMessageCount,
        unreadMessageAriaLabel,
        userHasHealthData,
      );
    },
    [
      featureToggles,
      ssoe,
      unreadMessageCount,
      unreadMessageAriaLabel,
      userHasHealthData,
    ],
  );

  const datadogRumConfig = {
    applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
    clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
    site: 'ddog-gov.com',
    service: 'mhv-on-va.gov',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 10,
    trackInteractions: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  };
  useDatadogRum(datadogRumConfig);

  const loading = vamcEhrData || featureToggles.loading || profile.loading;

  const redirecting = signedIn && !loading && !enabled;

  useEffect(
    () => {
      async function loadMessages() {
        const folders = await getFolderList();
        const unreadMessages = countUnreadMessages(folders);
        setUnreadMessageCount(unreadMessages);
      }
      if (enabled) {
        loadMessages();
      }
    },
    [enabled],
  );

  useEffect(
    () => {
      const redirect = () => {
        const redirectUrl = mhvUrl(ssoe, 'home');
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
