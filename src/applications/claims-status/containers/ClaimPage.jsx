import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { getClaim as getClaimAction } from '../actions';

export function ClaimPage({ getClaim }) {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getClaim(params.id, navigate);
  }, []);

  return <Outlet />;
}

const mapDispatchToProps = {
  getClaim: getClaimAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(ClaimPage);

ClaimPage.propTypes = {
  getClaim: PropTypes.func,
};
