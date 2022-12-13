import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom-v5-compat';

import { getClaimDetail as getClaimDetailAction } from '../actions';

const ClaimPage = ({ getClaimDetail }) => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getClaimDetail(params.id, navigate);
  });

  return <Outlet />;
};

const mapDispatchToProps = {
  getClaimDetail: getClaimDetailAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(ClaimPage);
