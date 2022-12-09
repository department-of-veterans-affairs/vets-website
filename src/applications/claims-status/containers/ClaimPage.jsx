import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getClaimDetail as getClaimDetailAction } from '../actions';

const ClaimPage = ({ children, getClaimDetail }) => {
  const params = useParams();

  useEffect(() => {
    getClaimDetail(params.id);
  }, []);

  return <>{children}</>;
};

ClaimPage.propTypes = {
  children: PropTypes.array,
  getClaimDetail: PropTypes.func,
  match: PropTypes.object,
};

const mapDispatchToProps = {
  getClaimDetail: getClaimDetailAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(ClaimPage);
