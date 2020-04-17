import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import recordEvent from 'platform/monitoring/record-event';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled as isMultifactorEnabledSelector,
  selectProfile,
} from 'platform/user/selectors';
import { ssoe as ssoeSelector } from 'platform/user/authentication/selectors';

import ProfileInfoTable from './ProfileInfoTable';
import TwoFactorAuthorizationStatus from './TwoFactorAuthorizationStatus';
import IdentityVerificationStatus from './IdentityVerificationStatus';
import MHVTermsAndConditionsStatus from './MHVTermsAndConditionsStatus';

export const AccountSecurityContent = ({
  isIdentityVerified,
  isMultifactorEnabled,
  mhvAccount,
  showMHVTermsAndConditions,
  useSSOe,
}) => {
  const data = [
    {
      title: 'Identity verification',
      value: (
        <IdentityVerificationStatus isIdentityVerified={isIdentityVerified} />
      ),
    },
    {
      title: '2-factor authentication',
      value: (
        <TwoFactorAuthorizationStatus
          isMultifactorEnabled={isMultifactorEnabled}
          useSSOe={useSSOe}
        />
      ),
    },
  ];

  if (showMHVTermsAndConditions) {
    data.push({
      title: 'Terms and conditions',
      value: <MHVTermsAndConditionsStatus mhvAccount={mhvAccount} />,
    });
  }

  return (
    <>
      <ProfileInfoTable data={data} fieldName="accountSecurity" />
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
  };
};

export default connect(mapStateToProps)(AccountSecurityContent);
