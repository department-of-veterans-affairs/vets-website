import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { getClaim as getClaimAction } from '../actions';

export const ClaimPage = ({ getClaim }) => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getClaim(params.id, navigate);
  });

  return <Outlet />;
};

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
