import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { CSP_IDS } from 'platform/user/authentication/constants';

import {
  cnpDirectDepositLoadError,
  eduDirectDepositLoadError,
  cnpDirectDepositIsBlocked,
} from '@@profile/selectors';
import VerifyIdentiy from './alerts/VerifyIdentiy';
import ServiceDown from './alerts/ServiceDown';
import DirectDepositBlocked from './alerts/DirectDepositBlocked';

const DirectDepositWrapper = props => {
  const { children, setViewingIsRestricted } = props;
  const { profile, loading } = useSelector(state => state.user || {});
  const cnpError = useSelector(cnpDirectDepositLoadError);
  const eduError = useSelector(eduDirectDepositLoadError);
  const isBlocked = useSelector(cnpDirectDepositIsBlocked);

  if (loading) {
    return <va-loading-indicator />;
  }

  const errored = !!cnpError || !!eduError;
  if (errored) {
    setViewingIsRestricted(true);
    return <ServiceDown />;
  }

  if (isBlocked) {
    setViewingIsRestricted(true);
    return <DirectDepositBlocked />;
  }

  const {
    signIn: { serviceName },
  } = profile;

  if (
    !serviceName ||
    serviceName === CSP_IDS.DS_LOGON ||
    serviceName === CSP_IDS.MHV
  ) {
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
