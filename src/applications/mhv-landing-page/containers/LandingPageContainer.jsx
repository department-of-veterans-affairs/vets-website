import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getMHVAccount, getFolderList } from '../utilities/api';
import LandingPage from '../components/LandingPage';
import {
  resolveLandingPageLinks,
  countUnreadMessages,
  resolveUnreadMessageAriaLabel,
} from '../utilities/data';
import {
  isAuthenticatedWithSSOe,
  isLOA3,
  isVAPatient,
  selectProfile,
  signInServiceEnabled,
  hasMhvAccount,
  mhvAccountStatusLoading,
} from '../selectors';

import {
  fetchAccountStatus,
  fetchAccountStatusSuccess,
} from '../reducers/account';

const LandingPageContainer = () => {
  const dispatch = useDispatch();
  const mhvAccountStatusIsLoading = useSelector(mhvAccountStatusLoading);
  const { featureToggles, user } = useSelector(state => state);
  const [unreadMessageCount, setUnreadMessageCount] = useState();
  const profile = useSelector(selectProfile);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const useSiS = useSelector(signInServiceEnabled);
  const userVerified = useSelector(isLOA3);
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

  const loading =
    featureToggles.loading || profile.loading || mhvAccountStatusIsLoading;

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
    [userHasMhvAccount, loading],
  );

  useEffect(
    () => {
      // For accessibility purposes.
      focusElement('h1');
    },
    [loading],
  );

  useEffect(
    () => {
      if (!profile.loading && userVerified) {
        if (userHasMhvAccount) {
          dispatch({
            type: fetchAccountStatusSuccess,
            data: { error: false },
          });
        } else {
          dispatch({ type: fetchAccountStatus });

          getMHVAccount().then(resp => {
            dispatch({
              type: fetchAccountStatusSuccess,
              data: resp,
            });
          });
        }
      }
    },
    [userHasMhvAccount, profile.loading, userVerified, dispatch],
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

export default LandingPageContainer;
