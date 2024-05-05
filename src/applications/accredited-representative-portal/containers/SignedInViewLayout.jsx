import PropTypes from 'prop-types';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import Sidenav from '../components/common/Sidenav';
import Breadcrumbs from '../components/common/Breadcrumbs';

const SignedInViewLayout = ({ poaPermissions = true }) => {
  let content = null;

  // If the VSO does not have permission to be Power of Attorney ( this will eventually be pulled from Redux state)
  if (!poaPermissions) {
    content = (
      <va-alert
        data-testid="signed-in-view-layout-permissions-alert"
        status="info"
        visible
      >
        <h2 slot="headline">You are missing some permissions</h2>
        <div>
          <p className="vads-u-margin-y--0">
            In order to access the features of the Accredited Representative
            Portal you need to have certain permissions, such as being
            registered with the VA to accept Power of Attorney for a Veteran.
          </p>
        </div>
      </va-alert>
    );
  }

  if (poaPermissions) {
    content = (
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
          <Sidenav />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="vads-u-margin-bottom--3">
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <Breadcrumbs />
          {content}
        </div>
      </div>
    </>
  );
};

SignedInViewLayout.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default SignedInViewLayout;
