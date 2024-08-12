import React from 'react';
import { useSelector } from 'react-redux';

// import { CSP_IDS } from '~/platform/user/authentication/constants';

import {
  AlertMhvBasicAccount,
  AlertMhvRegistration,
  // AlertNotVerified,
  AlertUnregistered,
  AlertVerifyAndRegister,
} from '../components/alerts';

import {
  hasMhvAccount,
  hasMhvBasicAccount,
  isAuthenticatedWithSSOe,
  isLOA3,
  isVAPatient,
  showVerifyAndRegisterAlert,
  signInServiceName,
} from '../selectors';

const Alerts = () => {
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const userRegistered = userVerified && vaPatient;
  const userHasMhvAccount = useSelector(hasMhvAccount);
  const userHasMhvBasicAccount = useSelector(hasMhvBasicAccount);
  const renderVerifyAndRegisterAlert = useSelector(showVerifyAndRegisterAlert);
  const cspId = useSelector(signInServiceName);
  const ssoe = useSelector(isAuthenticatedWithSSOe);

  if (userHasMhvBasicAccount) {
    return <AlertMhvBasicAccount ssoe={ssoe} />;
  }

  if (renderVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  // if (!userVerified && cspId === CSP_IDS.DS_LOGON) {
  //   return <AlertNotVerified cspId={cspId} />;
  // }

  if (!userRegistered) {
    return <AlertUnregistered />;
  }

  if (userRegistered && !userHasMhvAccount) {
    return <AlertMhvRegistration ssoe={ssoe} />;
  }

  return <></>;
};

export default Alerts;
