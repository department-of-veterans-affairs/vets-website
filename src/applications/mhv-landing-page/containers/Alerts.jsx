import React from 'react';
import { useSelector } from 'react-redux';

import {
  AlertMhvBasicAccount,
  AlertUnregistered,
  AlertVerifyAndRegister,
  AlertAccountApiAlert,
} from '../components/alerts';

import {
  hasMhvBasicAccount,
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
  const userHasMhvBasicAccount = useSelector(hasMhvBasicAccount);
  const renderVerifyAndRegisterAlert = useSelector(showVerifyAndRegisterAlert);
  const cspId = useSelector(signInServiceName);

  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);
  const mhvAccountStatusSortedErrors = useSelector(
    mhvAccountStatusErrorsSorted,
  );

  if (userHasMhvBasicAccount) {
    return <AlertMhvBasicAccount />;
  }

  if (renderVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  if (!userRegistered) {
    return <AlertUnregistered />;
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
