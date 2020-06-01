import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import {
  isLOA3 as isLOA3Selector,
  isInMVI as isInMVISelector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
  selectProfile,
} from 'platform/user/selectors';
import {
  ssoe as ssoeSelector,
  signInServiceName as signInServiceNameSelector,
} from 'platform/user/authentication/selectors';

import ProfileInfoTable from './ProfileInfoTable';
import TwoFactorAuthorizationStatus from './TwoFactorAuthorizationStatus';
import IdentityNotVerified from './IdentityNotVerified';
import NotInMVI from './NotInMVI';
import MHVTermsAndConditionsStatus from './MHVTermsAndConditionsStatus';
import EmailAddressNotification from './EmailAddressNotification';
import Verified from './Verified';

export const AccountSecurityContent = ({
  isIdentityVerified,
  isMultifactorEnabled,
  mhvAccount,
  showMHVTermsAndConditions,
  useSSOe,
  signInServiceName,
  isInMVI,
}) => {
  const securitySections = [
    {
      title: '2-factor authentication',
      value: (
        <TwoFactorAuthorizationStatus
          isMultifactorEnabled={isMultifactorEnabled}
          useSSOe={useSSOe}
        />
      ),
    },
    {
      title: 'Sign-in email address',
      value: <EmailAddressNotification signInServiceName={signInServiceName} />,
    },
  ];

  if (isIdentityVerified) {
    securitySections.unshift({
      title: 'Identity verification',
      value: <Verified>We’ve verified your identity.</Verified>,
    });
  }

  if (showMHVTermsAndConditions) {
    securitySections.push({
      title: 'Terms and conditions',
      value: <MHVTermsAndConditionsStatus mhvAccount={mhvAccount} />,
    });
  }

  return (
    <>
      {!isInMVI && <NotInMVI />}
      {!isIdentityVerified && isInMVI && <IdentityNotVerified />}
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
              event: 'account-navigation',
              'account-action': 'view-link',
              'account-section': 'vets-faqs',
            })
          }
        >
          Go to VA.gov FAQs
        </a>
      </AlertBox>
    </>
  );
};

AccountSecurityContent.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
  mhvAccount: PropTypes.object,
  showMHVTermsAndConditions: PropTypes.bool.isRequired,
  useSSOe: PropTypes.bool.isRequired,
};

export const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { verified, mhvAccount } = profile;
  const showMHVTermsAndConditions =
    verified && MHVTermsAndConditionsStatus.willRenderContent(mhvAccount);

  return {
    isIdentityVerified: isLOA3Selector(state),
    isMultifactorEnabled: isMultifactorEnabledSelector(state),
    mhvAccount,
    showMHVTermsAndConditions,
    useSSOe: ssoeSelector(state),
    isInMVI: isInMVISelector(state),
    signInServiceName: signInServiceNameSelector(state),
  };
};

export default connect(mapStateToProps)(AccountSecurityContent);
