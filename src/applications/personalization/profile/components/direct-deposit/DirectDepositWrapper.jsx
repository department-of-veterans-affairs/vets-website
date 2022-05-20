import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { CSP_IDS } from 'platform/user/authentication/constants';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import {
  cnpDirectDepositLoadError,
  eduDirectDepositLoadError,
} from '@@profile/selectors';
import VerifyIdentiy from './alerts/VerifyIdentiy';
import ServiceDown from './alerts/ServiceDown';

const DirectDepositWrapper = props => {
  const { children, setViewingIsRestricted } = props;
  const { profile, loading } = useSelector(state => state.user || {});
  const cnpError = useSelector(cnpDirectDepositLoadError);
  const eduError = useSelector(eduDirectDepositLoadError);

  const isWrapperEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.profileAlwaysShowDirectDepositDisplay
      ],
  );
  if (!isWrapperEnabled) {
    return <>{children}</>;
  }

  const errored = !!cnpError || !!eduError;
  if (loading) {
    return <va-loading-indicator />;
  }

  if (errored) {
    setViewingIsRestricted(true);
    return <ServiceDown />;
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
