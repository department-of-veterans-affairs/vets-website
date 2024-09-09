import PropTypes from 'prop-types';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import NoPOAPermissionsAlert from '../components/NoPOAPermissionsAlert/NoPOAPermissionsAlert';
import NotInPilotAlert from '../components/NotInPilotAlert/NotInPilotAlert';

const SignedInLayout = ({
  isPilotToggleLoading,
  isInPilot,
  isProduction,
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
    <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div data-testid="signed-in-layout-content" className="vads-l-row">
        <Outlet />
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
