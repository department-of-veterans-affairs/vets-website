import React, { useEffect, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { isAuthenticatedWithSSOe } from '@department-of-veterans-affairs/platform-user/authentication/selectors';

import LandingPage from '../components/LandingPage';
import { getFolderList } from '../api/SmApi';
import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';
import {
  countUnreadMessages,
  resolveLandingPageLinks,
} from '../utilities/data';

import { useDatadogRum } from '../hooks/useDatadogRum';

const App = () => {
  const fullState = useSelector(state => state);
  const { drupalStaticData, featureToggles, user } = fullState;
  const [unreadMessageCount, setUnreadMessageCount] = useState();
  const loading =
    featureToggles?.loading ||
    user?.profile?.loading ||
    drupalStaticData?.vamcEhrData?.loading;

  const data = useMemo(
    () => {
      const authdWithSSOe = isAuthenticatedWithSSOe(fullState) || false;
      return resolveLandingPageLinks(
        authdWithSSOe,
        featureToggles,
        unreadMessageCount,
      );
    },
    [featureToggles, fullState, unreadMessageCount],
  );

  const appEnabled = useMemo(() => isLandingPageEnabledForUser(fullState), [
    fullState,
  ]);

  useEffect(
    () => {
      async function loadMessages() {
        const folders = await getFolderList().catch(() => []);
        const unreadMessages = countUnreadMessages(folders);

        setUnreadMessageCount(unreadMessages);
      }

      if (!loading && appEnabled) {
        loadMessages();
      }
    },
    [appEnabled, loading],
  );

  useDatadogRum();

  if (!appEnabled) {
    const ssoe = isAuthenticatedWithSSOe(fullState);
    const url = mhvUrl(ssoe, 'home');
    // console.log(`Redirecting to ${url}`);
    window.location.replace(url);
    return <></>;
  }
  if (loading) {
    return <va-loading-indicator />;
  }
  return <LandingPage data={data} />;
};

export default App;
