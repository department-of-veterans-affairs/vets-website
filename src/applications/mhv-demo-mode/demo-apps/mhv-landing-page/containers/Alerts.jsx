import React from 'react';
import { useSelector } from 'react-redux';

import {
  AlertUnregistered,
  AlertVerifyAndRegister,
  AlertAccountApiAlert,
} from '../components/alerts';

import {
  isAuthenticatedWithSSOe,
  isLOA3,
  isVAPatient,
  mhvAccountStatusUserError,
  mhvAccountStatusErrorsSorted,
  showVerifyAndRegisterAlert,
  signInServiceName,
} from '../selectors';

const Alerts = () => {
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const userRegistered = userVerified && vaPatient;
  const renderVerifyAndRegisterAlert = useSelector(showVerifyAndRegisterAlert);
  const cspId = useSelector(signInServiceName);
  const ssoe = useSelector(isAuthenticatedWithSSOe);

  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);
  const mhvAccountStatusSortedErrors = useSelector(
    mhvAccountStatusErrorsSorted,
  );

  if (renderVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  if (!userRegistered) {
    return <AlertUnregistered ssoe={ssoe} />;
  }

  if (mhvAccountStatusSortedErrors.length > 0) {
    return (
      <AlertAccountApiAlert
        userActionable={mhvAccountStatusUserErrors.length > 0}
        errorCode={mhvAccountStatusSortedErrors[0].code}
      />
    );
  }

  return <></>;
};

export default Alerts;
