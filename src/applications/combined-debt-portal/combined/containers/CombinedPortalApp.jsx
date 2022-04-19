import React from 'react';
import { useSelector } from 'react-redux';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import {
  combinedPortalAccess,
  selectLoadingFeatureFlags,
} from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const CombinedPortalApp = ({ children }) => {
  const isCombinedPortalActive = useSelector(state =>
    combinedPortalAccess(state),
  );
  const isLoadingFlags = useSelector(state => selectLoadingFeatureFlags(state));

  if (isLoadingFlags) {
    return <LoadingSpinner />;
  }
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
