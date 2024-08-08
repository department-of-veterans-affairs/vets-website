import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import AlertUnregistered from '../components/alerts/AlertUnregistered';
import AlertMhvRegistration from '../components/alerts/AlertMhvRegistration';
import AlertNotVerified from '../components/alerts/AlertNotVerified';
import AlertMhvBasicAccount from '../components/alerts/AlertMhvBasicAccount';
import AlertVerifyAndRegister from '../components/alerts/AlertVerifyAndRegister';

import {
  hasMhvAccount,
  hasMhvBasicAccount,
  showVerifyAndRegisterAlert as showVerifyAndRegisterAlertFn,
  signInServiceName,
} from '../selectors';

const Alerts = ({
  userRegistered,
  userVerified,
  showVerifyAndRegisterAlert,
}) => {
  const userHasMhvAccount = useSelector(hasMhvAccount);
  const userHasMhvBasicAccount = useSelector(hasMhvBasicAccount);
  const showsVerifyAndRegisterAlert = useSelector(showVerifyAndRegisterAlert);
  const signInService = useSelector(signInServiceName);

  if (userHasMhvBasicAccount) {
    return <AlertMhvBasicAccount />;
  }

  if (showsVerifyAndRegisterAlert) {
    return <AlertVerifyAndRegister cspId={signInService} />;
  }

  if (!userVerified && !userHasMhvBasicAccount) {
    return <AlertNotVerified signInService={signInService} />;
  }

  if (!userRegistered) {
    return <AlertUnregistered />;
  }

  if (userRegistered && !userHasMhvAccount) {
    return <AlertMhvRegistration />;
  }

  return <></>;
};

Alerts.defaultProps = {
  showVerifyAndRegisterAlert: showVerifyAndRegisterAlertFn,
};

Alerts.propTypes = {
  showVerifyAndRegisterAlert: PropTypes.func.isRequired,
  userRegistered: PropTypes.bool.isRequired,
  userVerified: PropTypes.bool.isRequired,
};

export default Alerts;
