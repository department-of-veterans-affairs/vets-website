import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import LandingPage from '../components/LandingPage';

import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { getFolderList } from '../api/SmApi';
import { isLandingPageEnabledForUser } from '../utilities/feature-toggles';
import { resolveLandingPageLinks } from '../utilities/data';

import { useDatadogRum } from '../hooks/useDatadogRum';

const App = () => {
  const fullState = useSelector(state => state);
  const { featureToggles, user } = fullState;
  const [unreadMessageCount, setUnreadMessageCount] = useState();

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

  const appEnabled = useMemo(
    () => {
      return isLandingPageEnabledForUser(fullState);
    },
    [fullState],
  );

  useEffect(
    () => {
      async function loadMessages() {
        try {
          const messages = await getFolderList();
          const unreadMessages = messages.data.reduce(
            (accumulator, currentValue) => {
              return accumulator + currentValue.attributes.unreadCount;
            },
            0,
          );
          setUnreadMessageCount(unreadMessages);
        } catch (e) {
          console.error('Error getting unread message count', e);
        }
      }

      if (appEnabled) {
        loadMessages();
      }
    },
    [appEnabled],
  );

  useDatadogRum();

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
