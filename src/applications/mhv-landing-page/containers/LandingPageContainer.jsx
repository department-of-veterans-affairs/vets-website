import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getFolderList } from '../utilities/api';
import LandingPage from '../components/LandingPage';
import NonPatientLandingPage from '../components/nonPatientPage/NonPatientLandingPage';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAccountCreationApi } from '../hooks';
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
  hasMessagingAccess,
  mhvAccountStatusLoading,
} from '../selectors';

const LandingPageContainer = () => {
  const mhvAccountStatusIsLoading = useSelector(mhvAccountStatusLoading);
  const { featureToggles, user } = useSelector(state => state);
  const [unreadMessageCount, setUnreadMessageCount] = useState();
  const profile = useSelector(selectProfile);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const useSiS = useSelector(signInServiceEnabled);
  const registered = useSelector(isVAPatient);
  const unreadMessageAriaLabel = resolveUnreadMessageAriaLabel(
    unreadMessageCount,
  );
  const userHasMessagingAccess = useSelector(hasMessagingAccess);
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const verifiedNonVaPatient = userVerified && !vaPatient;

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
      if (userHasMessagingAccess) {
        loadMessages();
      }
    },
    [userHasMessagingAccess, loading],
  );

  useEffect(
    () => {
      // For accessibility purposes.
      focusElement('h1');
    },
    [loading],
  );

  useAccountCreationApi();

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
      <ErrorBoundary>
        {verifiedNonVaPatient ? (
          <NonPatientLandingPage data={data} />
        ) : (
          <LandingPage data={data} />
        )}
      </ErrorBoundary>
    </RequiredLoginView>
  );
};

export default LandingPageContainer;
