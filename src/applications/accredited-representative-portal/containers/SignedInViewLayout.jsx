import PropTypes from 'prop-types';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

const SignedInViewLayout = ({ poaPermissions = true }) => {
  let content = null;

  // If the VSO does not have permission to be Power of Attorney ( this will eventually be pulled from Redux state)
  if (!poaPermissions) {
    content = (
      <va-alert
        data-testid="signed-in-view-layout-permissions-alert"
        status="error"
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
  } else {
    content = <Outlet />;
  }

  return (
    <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">{content}</div>
    </div>
  );
};

SignedInViewLayout.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default SignedInViewLayout;
