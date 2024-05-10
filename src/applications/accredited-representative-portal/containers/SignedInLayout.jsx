import PropTypes from 'prop-types';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import NotInPilotError from '../components/NotInPilotError/NotInPilotError';
import NoPOAPermissionsError from '../components/NoPOAPermissionsError/NoPOAPermissionsError';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Sidenav from '../components/common/Sidenav';

const SignedInLayout = ({
  isPilotToggleLoading,
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

  if (environment.isProduction() && !isInPilot) {
    return <NotInPilotError />;
  }

  if (!hasPOAPermissions) {
    return <NoPOAPermissionsError />;
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
  isInPilot: PropTypes.bool,
  isPilotToggleLoading: PropTypes.bool,
  poaPermissions: PropTypes.bool,
};

export default SignedInLayout;
