import React from 'react';
import { useSelector } from 'react-redux';

import {
  AlertMhvBasicAccount,
  AlertMhvRegistration,
  AlertUnregistered,
  AlertVerifyAndRegister,
  AlertMhvUserAction,
} from '../components/alerts';

import {
  hasMhvAccount,
  hasMhvBasicAccount,
  isAuthenticatedWithSSOe,
  isLOA3,
  isVAPatient,
  mhvAccountStatusLoading,
  mhvAccountStatusUserError,
  mhvAccountStatusUsersuccess,
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
  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);
  const mhvAccountStatusSuccess = useSelector(mhvAccountStatusUsersuccess);
  const mhvAccountStatusIsLoading = useSelector(mhvAccountStatusLoading);

  if (userHasMhvBasicAccount) {
    return <AlertMhvBasicAccount ssoe={ssoe} />;
  }

  if (renderVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  if (!userRegistered) {
    return <AlertUnregistered />;
  }

  if (mhvAccountStatusUserErrors.length > 0) {
    return (
      <AlertMhvUserAction errorCode={mhvAccountStatusUserErrors[0].code} />
    );
  }
  if (
    userRegistered &&
    !userHasMhvAccount &&
    !mhvAccountStatusIsLoading &&
    !mhvAccountStatusSuccess
  ) {
    return <AlertMhvRegistration ssoe={ssoe} />;
  }

  return <></>;
};

export default Alerts;
