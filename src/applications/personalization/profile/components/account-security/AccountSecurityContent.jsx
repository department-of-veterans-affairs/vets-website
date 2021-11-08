import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
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
import EmailAddressNotification from '../personal-information/email-addresses/EmailAddressNotification';
import Verified from './Verified';

export const AccountSecurityContent = ({
  isIdentityVerified,
  isMultifactorEnabled,
  mhvAccount,
  showMHVTermsAndConditions,
  showWeHaveVerifiedYourID,
  showMPIConnectionError,
  showNotInMPIError,
  signInServiceName,
}) => {
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
      {!isIdentityVerified && (
        <IdentityNotVerified
          alertHeadline="Verify your identity to view your complete profile"
          additionalInfoClickHandler={() =>
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'additional-info': 'learn-more-identity',
            })
          }
          level={2}
        />
      )}
      {showMPIConnectionError && (
        <MPIConnectionError
          level={2}
          className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4"
        />
      )}
      {showNotInMPIError && (
        <NotInMPIError
          level={2}
          className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4"
        />
      )}
      <ProfileInfoTable data={securitySections} fieldName="accountSecurity" />
      <AlertBox
        status="info"
        headline="Have questions about signing in to VA.gov?"
        className="medium-screen:vads-u-margin-top--4"
        backgroundOnly
        level={2}
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <p>
            Get answers to frequently asked questions about how to sign in,
            common issues with verifying your identity, and your privacy and
            security on VA.gov.
          </p>

          <h3 className="vads-u-font-size--h4">
            Go to FAQs about these topics:
          </h3>
          <a
            href="/resources/signing-in-to-vagov/"
            className="vads-u-margin-y--1"
            onClick={() =>
              recordEvent({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'vets-faqs',
              })
            }
          >
            Signing in to VA.gov
          </a>
          <a
            href="/resources/verifying-your-identity-on-vagov/"
            className="vads-u-margin-y--1"
            onClick={() =>
              recordEvent({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'vets-faqs',
              })
            }
          >
            Verifying your identity on VA.gov
          </a>
          <a
            href="/resources/privacy-and-security-on-vagov/"
            className="vads-u-margin-y--1"
            onClick={() =>
              recordEvent({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'vets-faqs',
              })
            }
          >
            Privacy and security on VA.gov
          </a>
        </div>
      </AlertBox>
    </>
  );
};

AccountSecurityContent.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isInMPI: PropTypes.bool.isRequired,
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

  return {
    isIdentityVerified,
    isMultifactorEnabled: isMultifactorEnabledSelector(state),
    mhvAccount,
    showWeHaveVerifiedYourID,
    showMPIConnectionError,
    showNotInMPIError,
    showMHVTermsAndConditions,
    signInServiceName: signInServiceNameSelector(state),
  };
};

export default connect(mapStateToProps)(AccountSecurityContent);
