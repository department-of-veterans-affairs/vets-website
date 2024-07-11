import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import LandingPage from '../components/LandingPage';
import {
  resolveLandingPageLinks,
  countUnreadMessages,
  resolveUnreadMessageAriaLabel,
} from '../utilities/data';
import {
  isAuthenticatedWithSSOe,
  isVAPatient,
  selectProfile,
  signInServiceEnabled,
  hasMhvAccount,
} from '../selectors';
import { getFolderList } from '../utilities/api';

const App = () => {
  const { featureToggles, user } = useSelector(state => state);
  const [unreadMessageCount, setUnreadMessageCount] = useState();
  const profile = useSelector(selectProfile);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const useSiS = useSelector(signInServiceEnabled);
  const registered = useSelector(isVAPatient);
  const unreadMessageAriaLabel = resolveUnreadMessageAriaLabel(
    unreadMessageCount,
  );
  const userHasMhvAccount = useSelector(hasMhvAccount);

  const data = useMemo(
    () => {
      return resolveLandingPageLinks(
        ssoe,
        featureToggles,
        unreadMessageAriaLabel,
        registered,
      );
    },
    [featureToggles, ssoe, unreadMessageAriaLabel, registered],
  );

  const loading = featureToggles.loading || profile.loading;

  useEffect(
    () => {
      async function loadMessages() {
        const folders = await getFolderList();
        const unreadMessages = countUnreadMessages(folders);
        setUnreadMessageCount(unreadMessages);
      }
      if (userHasMhvAccount) {
        loadMessages();
      }
    },
    [userHasMhvAccount],
  );

  useEffect(
    () => {
      // For accessibility purposes.
      focusElement('h1');
    },
    [loading],
  );

  if (loading)
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
