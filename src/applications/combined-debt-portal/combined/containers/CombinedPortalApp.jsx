import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import { isProfileLoading, isLoggedIn } from 'platform/user/selectors';
import { fetchDebtLetters } from '../actions/debts';
import { getStatements } from '../actions/copays';
import {
  combinedPortalAccess,
  selectLoadingFeatureFlags,
} from '../utils/helpers';

const CombinedPortalApp = ({ children }) => {
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const isCombinedPortalActive = useSelector(state =>
    combinedPortalAccess(state),
  );

  // Generic loading flags
  const isLoadingFlags = useSelector(state => selectLoadingFeatureFlags(state));
  const profileLoading = useSelector(state => isProfileLoading(state));
  const isPlatformLoading = isLoadingFlags || profileLoading;

  // Debt and Bill loading flags
  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );
  const { pending: isMcpLoading } = mcp;
  const { isPending, isPendingVBMS, isProfileUpdating } = debtLetters;
  const isDebtLoading = isPending || isPendingVBMS || isProfileUpdating;

  useEffect(
    () => {
      if (userLoggedIn) {
        fetchDebtLetters(dispatch);
        getStatements(dispatch);
      }
    },
    [dispatch, userLoggedIn],
  );

  // Authentication!
  if (!profileLoading && !userLoggedIn) {
    window.location.replace('/manage-va-debt/');
    return (
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
      />
    );
  }

  // Hold off on loading until everyone is ready
  if (isPlatformLoading || isMcpLoading || isDebtLoading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
      />
    );
  }

  if (!isCombinedPortalActive) {
    window.location.replace('/manage-va-debt');
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="vads-l-row">
        <DowntimeNotification
          appTitle="Debts and bills application"
          dependencies={[
            externalServices.mvi,
            externalServices.vbs,
            externalServices.dmc,
          ]}
        >
          {children}
        </DowntimeNotification>
      </div>
    </div>
  );
};

CombinedPortalApp.propTypes = {
  children: PropTypes.object,
};

export default CombinedPortalApp;
