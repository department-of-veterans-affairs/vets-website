import PropTypes from 'prop-types';
import React from 'react';
import { Outlet } from 'react-router-dom-v5-compat';

import POAPermissionsError from '../components/POAPermissionsError/POAPermissionsError';

const SignedInViewLayout = ({ poaPermissions = true }) => {
  return (
    <div className="vads-u-margin-y--5 vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row">
        {!poaPermissions ? <POAPermissionsError /> : <Outlet />}
      </div>
    </div>
  );
};

SignedInViewLayout.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default SignedInViewLayout;
