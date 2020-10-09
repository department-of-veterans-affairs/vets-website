import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import {
  isLOA3 as isLOA3Selector,
  isInMPI as isInMVISelector,
  hasMPIConnectionError as hasMPIConnectionErrorSelector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
  selectProfile,
} from 'platform/user/selectors';
import {
  isAuthenticatedWithSSOe as authenticatedWithSSOeSelector,
  signInServiceName as signInServiceNameSelector,
} from 'platform/user/authentication/selectors';

import ProfileInfoTable from './ProfileInfoTable';
import TwoFactorAuthorizationStatus from './TwoFactorAuthorizationStatus';
import IdentityNotVerified from './IdentityNotVerified';
import NotInMPIError from './NotInMPIError';
import MPIConnectionError from './MPIConnectionError';
import MHVTermsAndConditionsStatus from './MHVTermsAndConditionsStatus';
import EmailAddressNotification from './EmailAddressNotification';
import Verified from './Verified';

export const AccountSecurityContent = ({
  isIdentityVerified,
  isMultifactorEnabled,
  mhvAccount,
  showMHVTermsAndConditions,
  showWeHaveVerifiedYourID,
  showMPIConnectionError,
  showNotInMPIError,
  isAuthenticatedWithSSOe,
  signInServiceName,
}) => {
  const securitySections = [
    {
      title: '2-factor authentication',
      verified: isMultifactorEnabled,
      value: (
        <TwoFactorAuthorizationStatus
          isMultifactorEnabled={isMultifactorEnabled}
          isAuthenticatedWithSSOe={isAuthenticatedWithSSOe}
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
      {!isIdentityVerified && <IdentityNotVerified />}
      {showMPIConnectionError && <MPIConnectionError />}
      {showNotInMPIError && <NotInMPIError />}
      <ProfileInfoTable data={securitySections} fieldName="accountSecurity" />
      <AlertBox
        status="info"
        headline="Have questions about signing in to VA.gov?"
        className="medium-screen:vads-u-margin-top--4"
        backgroundOnly
      >
        <p>
          Get answers to frequently asked questions about how to sign in, common
          issues with verifying your identity, and your privacy and security on
          VA.gov.
        </p>
        <a
          href="/sign-in-faq/"
          onClick={() =>
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'vets-faqs',
            })
          }
        >
          Go to FAQs about signing in to VA.gov
        </a>
      </AlertBox>
    </>
  );
};

AccountSecurityContent.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isInMVI: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
  mhvAccount: PropTypes.shape({
    accountLevel: PropTypes.string,
    accountState: PropTypes.string,
    errors: PropTypes.array,
    loading: PropTypes.bool,
    termsAndConditionsAccepted: PropTypes.bool.isRequired,
  }),
  showMHVTermsAndConditions: PropTypes.bool.isRequired,
  signInServiceName: PropTypes.string.isRequired,
  authenticatedWithSSOe: PropTypes.bool.isRequired,
};

export const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { verified, mhvAccount } = profile;
  const showMHVTermsAndConditions =
    verified && MHVTermsAndConditionsStatus.willRenderContent(mhvAccount);
  const isInMVI = isInMVISelector(state);
  const isIdentityVerified = isLOA3Selector(state);
  const hasMPIConnectionError = hasMPIConnectionErrorSelector(state);
  const showMPIConnectionError = isIdentityVerified && hasMPIConnectionError;
  const showNotInMPIError =
    isIdentityVerified && !hasMPIConnectionError && !isInMVI;
  const showWeHaveVerifiedYourID = isInMVI && isIdentityVerified;

  return {
    isIdentityVerified,
    isMultifactorEnabled: isMultifactorEnabledSelector(state),
    mhvAccount,
    showWeHaveVerifiedYourID,
    showMPIConnectionError,
    showNotInMPIError,
    showMHVTermsAndConditions,
    signInServiceName: signInServiceNameSelector(state),
    isAuthenticatedWithSSOe: authenticatedWithSSOeSelector(state),
  };
};

export default connect(mapStateToProps)(AccountSecurityContent);
