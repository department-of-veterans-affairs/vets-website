import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import {
  clearClaim as clearClaimAction,
  getClaim as getClaimAction,
} from '../actions';

export function ClaimPage({ clearClaim, getClaim }) {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getClaim(params.id, navigate);
    // Reset claim and loading state on dismount.
    return () => clearClaim();
  }, []);

  return <Outlet />;
}

const mapDispatchToProps = {
  getClaim: getClaimAction,
  clearClaim: clearClaimAction,
};

export default connect(null, mapDispatchToProps)(ClaimPage);

ClaimPage.propTypes = {
  clearClaim: PropTypes.func,
  getClaim: PropTypes.func,
};
