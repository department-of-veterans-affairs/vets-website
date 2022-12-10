import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom-v5-compat';

import { getClaimDetail as getClaimDetailAction } from '../actions';

const ClaimPage = ({ getClaimDetail }) => {
  const params = useParams();

  useEffect(() => {
    getClaimDetail(params.id);
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
