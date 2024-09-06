import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import {
  getClaim as getClaimAction,
  clearClaim as clearClaimAction,
} from '../actions';

export function ClaimPage({ getClaim, clearClaim }) {
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

export default connect(
  null,
  mapDispatchToProps,
)(ClaimPage);

ClaimPage.propTypes = {
  getClaim: PropTypes.func,
  clearClaim: PropTypes.func,
};
