import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';
import {
  isLOA3 as isLOA3Selector,
  isInMPI as isInMPISelector,
  hasMPIConnectionError as hasMPIConnectionErrorSelector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
} from '~/platform/user/selectors';

import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import MPIConnectionError from '~/applications/personalization/components/MPIConnectionError';
import NotInMPIError from '~/applications/personalization/components/NotInMPIError';
import { AccountSecurityTables } from './AccountSecurityTables';
import {
  selectIsBlocked,
  selectShowCredRetirementMessaging,
} from '../../selectors';
import { AccountBlocked } from '../alerts/AccountBlocked';
import { AccountSecurityLoa1CredAlert } from '../alerts/CredentialRetirementAlerts';
import { signInServiceName } from '~/platform/user/authentication/selectors';

const IdNotVerifiedContent = () => {
  const signInService = useSelector(signInServiceName);
  const showCredRetirementMessaging = useSelector(
    selectShowCredRetirementMessaging,
  );
  return showCredRetirementMessaging ? (
    <AccountSecurityLoa1CredAlert />
  ) : (
    <IdentityNotVerified signInService={signInService} />
  );
};

export const AccountSecurityContent = ({
  isIdentityVerified,
  isMultifactorEnabled,
  showMPIConnectionError,
  showNotInMPIError,
  isBlocked,
}) => {
  return (
    <>
      {isBlocked && (
        <AccountBlocked recordCustomProfileEvent={recordCustomProfileEvent} />
      )}
      {!isIdentityVerified && <IdNotVerifiedContent />}
      {showMPIConnectionError && (
        <MPIConnectionError className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4" />
      )}
      {showNotInMPIError && (
        <NotInMPIError className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4" />
      )}
      <AccountSecurityTables
        isIdentityVerified={isIdentityVerified}
        isMultifactorEnabled={isMultifactorEnabled}
      />
    </>
  );
};

AccountSecurityContent.propTypes = {
  isBlocked: PropTypes.bool.isRequired,
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
  showMPIConnectionError: PropTypes.bool.isRequired,
  showNotInMPIError: PropTypes.bool.isRequired,
  showWeHaveVerifiedYourID: PropTypes.bool.isRequired,
};

export const mapStateToProps = state => {
  const isInMPI = isInMPISelector(state);
  const isIdentityVerified = isLOA3Selector(state);
  const hasMPIConnectionError = hasMPIConnectionErrorSelector(state);
  const showMPIConnectionError = isIdentityVerified && hasMPIConnectionError;
  const showNotInMPIError =
    isIdentityVerified && !hasMPIConnectionError && !isInMPI;
  const showWeHaveVerifiedYourID = isInMPI && isIdentityVerified;
  const isBlocked = selectIsBlocked(state);

  return {
    isBlocked,
    isIdentityVerified,
    isMultifactorEnabled: isMultifactorEnabledSelector(state),
    showMPIConnectionError,
    showNotInMPIError,
    showWeHaveVerifiedYourID,
  };
};

export default connect(mapStateToProps)(AccountSecurityContent);
