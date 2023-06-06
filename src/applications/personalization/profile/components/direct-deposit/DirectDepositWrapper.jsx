import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { CSP_IDS } from 'platform/user/authentication/constants';
import { isAuthenticatedWithOAuth } from 'platform/user/authentication/selectors';

import {
  cnpDirectDepositLoadError,
  eduDirectDepositLoadError,
  cnpDirectDepositIsBlocked,
} from '@@profile/selectors';
import VerifyIdentity from './alerts/VerifyIdentity';
import DirectDepositBlocked from './alerts/DirectDepositBlocked';
import LoadFail from '../alerts/LoadFail';

const DirectDepositWrapper = props => {
  const { children, setViewingIsRestricted } = props;
  const { profile, loading } = useSelector(state => state.user || {});
  const cnpError = useSelector(cnpDirectDepositLoadError);
  const eduError = useSelector(eduDirectDepositLoadError);
  const isBlocked = useSelector(cnpDirectDepositIsBlocked);
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  if (loading) {
    return <va-loading-indicator />;
  }

  const errored = !!cnpError || !!eduError;
  if (errored) {
    setViewingIsRestricted(true);
    return <LoadFail />;
  }

  if (isBlocked) {
    setViewingIsRestricted(true);
    return <DirectDepositBlocked />;
  }

  const {
    signIn: { serviceName },
  } = profile;

  if (!serviceName || [CSP_IDS.DS_LOGON, CSP_IDS.MHV].includes(serviceName)) {
    setViewingIsRestricted(true);
    return (
      <>
        <VerifyIdentity useOAuth={useOAuth} />
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
