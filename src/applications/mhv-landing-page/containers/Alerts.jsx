import React from 'react';
import { useSelector } from 'react-redux';

import AlertUnregistered from '../components/alerts/AlertUnregistered';
import AlertMhvRegistration from '../components/alerts/AlertMhvRegistration';
import AlertMhvBasicAccount from '../components/alerts/AlertMhvBasicAccount';
import AlertVerifyAndRegister from '../components/alerts/AlertVerifyAndRegister';

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
    return <AlertMhvBasicAccount />;
  }

  if (renderVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  if (!userRegistered) {
    return <AlertUnregistered />;
  }

  if (userRegistered && !userHasMhvAccount) {
    return <AlertMhvRegistration ssoe={ssoe} />;
  }

  return <></>;
};

export default Alerts;
