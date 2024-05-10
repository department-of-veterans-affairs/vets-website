import PropTypes from 'prop-types';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NotInPilotAlert from '../components/NotInPilotAlert/NotInPilotAlert';
import NoPOAPermissionsAlert from '../components/NoPOAPermissionsAlert/NoPOAPermissionsAlert';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Sidenav from '../components/common/Sidenav';

const SignedInLayout = ({
  isPilotToggleLoading,
  isProduction,
  isInPilot,
  hasPOAPermissions,
}) => {
  if (isPilotToggleLoading) {
    return (
      <div
        className="vads-u-margin-y--5"
        data-testid="signed-in-layout-pilot-toggle-loading"
      >
        <VaLoadingIndicator message="Loading your Accredited Representative Portal..." />
      </div>
    );
  }

  if (isProduction && !isInPilot) {
    return <NotInPilotAlert />;
  }

  if (!hasPOAPermissions) {
    return <NoPOAPermissionsAlert />;
  }

  return (
    <div className="vads-u-margin-bottom--3">
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <Breadcrumbs />
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
            <Sidenav />
          </div>
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

SignedInLayout.propTypes = {
  hasPOAPermissions: PropTypes.bool,
  isInPilot: PropTypes.bool,
  isPilotToggleLoading: PropTypes.bool,
  isProduction: PropTypes.bool,
};

export default SignedInLayout;
