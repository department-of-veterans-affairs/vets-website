import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { CSP_IDS } from 'platform/user/authentication/constants';

import VerifyIdentiy from './alerts/VerifyIdentiy';

const DirectDepositWrapper = props => {
  const { children, setViewingIsRestricted } = props;
  const { profile, loading } = useSelector(state => state.user || {});
  if (loading) {
    return <va-loading-indicator />;
  }

  const {
    signIn: { serviceName },
  } = profile;
  if (serviceName === CSP_IDS.DS_LOGON || serviceName === CSP_IDS.MHV) {
    setViewingIsRestricted(true);
    return (
      <>
        <VerifyIdentiy />
      </>
    );
  }
  return <>{children}</>;
};

DirectDepositWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  setViewingIsRestricted: PropTypes.func.isRequired,
};

export default DirectDepositWrapper;
