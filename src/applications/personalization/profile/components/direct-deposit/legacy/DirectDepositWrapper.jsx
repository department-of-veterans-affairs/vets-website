import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  cnpDirectDepositLoadError,
  selectIsBlocked,
} from '@@profile/selectors';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import { isAuthenticatedWithOAuth } from '~/platform/user/authentication/selectors';

import VerifyIdentity from '../alerts/VerifyIdentity';
import DirectDepositBlocked from '../alerts/DirectDepositBlocked';
import LoadFail from '../../alerts/LoadFail';

const DirectDepositWrapper = props => {
  const { children, setViewingIsRestricted } = props;
  const { profile, loading } = useSelector(state => state.user || {});
  const cnpError = useSelector(cnpDirectDepositLoadError);
  const isBlocked = useSelector(selectIsBlocked);
  const useOAuth = useSelector(isAuthenticatedWithOAuth);

  if (loading) {
    return <va-loading-indicator />;
  }

  // If we have an error loading the CNP direct deposit information, we should
  // not show the direct deposit page, since we wont be able to get control info from that service either
  if (cnpError) {
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
