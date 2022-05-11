import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import { isProfileLoading } from 'platform/user/selectors';
import { fetchDebtLetters } from '../actions/debts';
import { getStatements } from '../actions/copays';
import {
  combinedPortalAccess,
  selectLoadingFeatureFlags,
} from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const CombinedPortalApp = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      fetchDebtLetters(dispatch);
      getStatements(dispatch);
    },
    [dispatch],
  );

  const isCombinedPortalActive = useSelector(state =>
    combinedPortalAccess(state),
  );

  // Generic loading flags
  const isLoadingFlags = useSelector(state => selectLoadingFeatureFlags(state));
  const profileLoading = useSelector(state => isProfileLoading(state));
  // Debt and Bill loading flags
  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );
  const { pending } = mcp;
  const { isPending, isPendingVBMS, isProfileUpdating } = debtLetters;

  // Hold off on loading until everyone is ready
  if (
    isLoadingFlags ||
    profileLoading ||
    pending ||
    isPending ||
    isPendingVBMS ||
    isProfileUpdating
  ) {
    return <LoadingSpinner />;
  }

  // TODO: we'll probably need to have a unauth redirect checking 'userLoggedIn'
  if (!isCombinedPortalActive) {
    window.location.replace('/');
    return <></>;
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-margin-bottom--5">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--8">
          <DowntimeNotification
            appTitle="Debts and bills application"
            dependencies={[externalServices.mvi, externalServices.vbs]}
          >
            {children}
          </DowntimeNotification>
        </div>
      </div>
    </div>
  );
};

CombinedPortalApp.propTypes = {
  children: PropTypes.object,
};

export default CombinedPortalApp;
