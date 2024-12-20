import React from 'react';
import { useSelector } from 'react-redux';

import {
  AlertMhvBasicAccount,
  AlertMhvRegistration,
  AlertUnregistered,
  AlertVerifyAndRegister,
  AlertMhvUserAction,
  AlertMhvNoAction,
} from '../components/alerts';

import {
  apiAccountStatusEnabled,
  hasMhvAccount,
  hasMhvBasicAccount,
  isAuthenticatedWithSSOe,
  isLOA3,
  isVAPatient,
  mhvAccountStatusLoading,
  mhvAccountStatusUserError,
  mhvAccountStatusUsersuccess,
  mhvAccountStatusNonUserError,
  showVerifyAndRegisterAlert,
  signInServiceName,
} from '../selectors';

const Alerts = () => {
  const isAccountStatusApiEnabled = useSelector(apiAccountStatusEnabled);
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const userRegistered = userVerified && vaPatient;
  const userHasMhvAccount = useSelector(hasMhvAccount);
  const userHasMhvBasicAccount = useSelector(hasMhvBasicAccount);
  const renderVerifyAndRegisterAlert = useSelector(showVerifyAndRegisterAlert);
  const cspId = useSelector(signInServiceName);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const mhvAccountStatusNonUserErrors = useSelector(
    mhvAccountStatusNonUserError,
  );
  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);
  const mhvAccountStatusSuccess = useSelector(mhvAccountStatusUsersuccess);
  const mhvAccountStatusIsLoading = useSelector(mhvAccountStatusLoading);

  if (userHasMhvBasicAccount) {
    return <AlertMhvBasicAccount />;
  }

  if (renderVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  if (!userRegistered) {
    return <AlertUnregistered />;
  }

  if (mhvAccountStatusNonUserErrors.length > 0 && isAccountStatusApiEnabled) {
    return (
      <AlertMhvNoAction errorCode={mhvAccountStatusNonUserErrors[0].code} />
    );
  }

  if (mhvAccountStatusUserErrors.length > 0 && isAccountStatusApiEnabled) {
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
