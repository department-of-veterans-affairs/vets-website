import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import {
  isLOA3 as isLOA3Selector,
  isInMPI as isInMPISelector,
  hasMPIConnectionError as hasMPIConnectionErrorSelector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
  selectProfile,
} from 'platform/user/selectors';
import { signInServiceName as signInServiceNameSelector } from 'platform/user/authentication/selectors';

import MPIConnectionError from '~/applications/personalization/components/MPIConnectionError';
import NotInMPIError from '~/applications/personalization/components/NotInMPIError';
import IdentityNotVerified from '~/applications/personalization/components/IdentityNotVerified';
import ProfileInfoTable from '../ProfileInfoTable';
import TwoFactorAuthorizationStatus from './TwoFactorAuthorizationStatus';
import MHVTermsAndConditionsStatus from './MHVTermsAndConditionsStatus';
import EmailAddressNotification from '../contact-information/email-addresses/EmailAddressNotification';
import Verified from './Verified';
import { selectIsBlocked } from '../../selectors';
import { AccountBlocked } from '../alerts/AccountBlocked';
import { recordCustomProfileEvent } from '../../util';

export const AccountSecurityContent = ({
  isIdentityVerified,
  isMultifactorEnabled,
  mhvAccount,
  showMHVTermsAndConditions,
  showWeHaveVerifiedYourID,
  showMPIConnectionError,
  showNotInMPIError,
  signInServiceName,
  isBlocked,
}) => {
  const handlers = {
    learnMoreIdentity: () => {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'view-link',
        'additional-info': 'learn-more-identity',
      });
    },
    vetsFAQ: () => {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': 'view-link',
        'profile-section': 'vets-faqs',
      });
    },
  };
  const securitySections = [
    {
      title: '2-factor authentication',
      verified: isMultifactorEnabled,
      value: (
        <TwoFactorAuthorizationStatus
          isMultifactorEnabled={isMultifactorEnabled}
        />
      ),
    },
  ];

  if (showWeHaveVerifiedYourID) {
    securitySections.unshift({
      title: 'Identity verification',
      verified: true,
      value: <Verified>We’ve verified your identity.</Verified>,
    });
  }

  if (showMHVTermsAndConditions) {
    securitySections.push({
      title: 'Terms and conditions',
      verified: mhvAccount.termsAndConditionsAccepted,
      value: <MHVTermsAndConditionsStatus mhvAccount={mhvAccount} />,
    });
  }

  securitySections.push({
    title: 'Sign-in email address',
    value: <EmailAddressNotification signInServiceName={signInServiceName} />,
  });

  return (
    <>
      {isBlocked && (
        <AccountBlocked recordCustomProfileEvent={recordCustomProfileEvent} />
      )}
      {!isIdentityVerified && (
        <IdentityNotVerified
          additionalInfoClickHandler={handlers.learnMoreIdentity}
        />
      )}
      {showMPIConnectionError && (
        <MPIConnectionError
          level={2}
          className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4"
        />
      )}
      {showNotInMPIError && (
        <NotInMPIError className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4" />
      )}
      <ProfileInfoTable
        data={securitySections}
        fieldName="accountSecurity"
        level={3}
      />
    </>
  );
};

AccountSecurityContent.propTypes = {
  isBlocked: PropTypes.bool.isRequired,
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
  showMHVTermsAndConditions: PropTypes.bool.isRequired,
  showMPIConnectionError: PropTypes.bool.isRequired,
  showNotInMPIError: PropTypes.bool.isRequired,
  showWeHaveVerifiedYourID: PropTypes.bool.isRequired,
  signInServiceName: PropTypes.string.isRequired,
  isInMPI: PropTypes.bool,
  mhvAccount: PropTypes.shape({
    accountLevel: PropTypes.string,
    accountState: PropTypes.string,
    errors: PropTypes.array,
    loading: PropTypes.bool,
    termsAndConditionsAccepted: PropTypes.bool.isRequired,
  }),
};

export const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { verified, mhvAccount } = profile;
  const showMHVTermsAndConditions =
    verified && MHVTermsAndConditionsStatus.willRenderContent(mhvAccount);
  const isInMPI = isInMPISelector(state);
  const isIdentityVerified = isLOA3Selector(state);
  const hasMPIConnectionError = hasMPIConnectionErrorSelector(state);
  const showMPIConnectionError = isIdentityVerified && hasMPIConnectionError;
  const showNotInMPIError =
    isIdentityVerified && !hasMPIConnectionError && !isInMPI;
  const showWeHaveVerifiedYourID = isInMPI && isIdentityVerified;
  const isBlocked = selectIsBlocked(state);

  return {
    isIdentityVerified,
    isMultifactorEnabled: isMultifactorEnabledSelector(state),
    mhvAccount,
    showWeHaveVerifiedYourID,
    showMPIConnectionError,
    showNotInMPIError,
    showMHVTermsAndConditions,
    signInServiceName: signInServiceNameSelector(state),
    isBlocked,
  };
};

export default connect(mapStateToProps)(AccountSecurityContent);
