import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { mfa } from '~/platform/user/authentication/utilities';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';

import EmailAddressNotification from '../contact-information/email-addresses/EmailAddressNotification';
import ProfileInfoTable from '../ProfileInfoTable';

import { ConditionalProcessList as List } from './ConditionalProcessList';

const mfaHandler = () => {
  recordEvent({ event: AUTH_EVENTS.MFA });
  mfa();
};

const termsAndConditionsUrl =
  '/health-care/medical-information-terms-conditions';

const AccountSetupTable = ({
  title,
  isIdentityVerified,
  isMultifactorEnabled,
  showMHVTermsAndConditions,
  mhvAccount,
}) => {
  return (
    <section className="profile-info-table vads-u-margin-bottom--2 vads-u-border--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-background-color--gray-lightest vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-color--gray-darkest vads-u-margin--0 vads-u-padding-x--2 vads-u-padding-y--1p5 vads-u-font-size--h3 medium-screen:vads-u-padding-x--4 medium-screen:vads-u-padding-y--2 heading">
        {title}
      </h2>

      <List>
        <List.Item complete={isIdentityVerified}>
          <List.HeadingComplete>Verify your identity</List.HeadingComplete>

          <List.ContentComplete>
            We’ve verified your identity.
          </List.ContentComplete>

          <List.HeadingIncomplete>
            <a href="/verify">Verify your identity</a>
          </List.HeadingIncomplete>

          <List.ContentIncomplete>
            Verify your identity to view your complete profile.
          </List.ContentIncomplete>
        </List.Item>

        <List.Item complete={isMultifactorEnabled}>
          <List.HeadingComplete>
            Add 2-factor authentication
          </List.HeadingComplete>

          <List.ContentComplete>
            You’ve added an extra layer of security to your account with
            2-factor authentication.
          </List.ContentComplete>

          <List.HeadingIncomplete>
            <button
              onClick={mfaHandler}
              className="va-button-link vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--h4"
              type="button"
            >
              Add 2-factor authentication
            </button>
          </List.HeadingIncomplete>

          <List.ContentIncomplete>
            Add an extra layer of security (called 2-factor authentication).
            This helps to make sure only you can access your account—even if
            someone gets your password.
          </List.ContentIncomplete>
        </List.Item>

        <List.Item
          complete={mhvAccount.termsAndConditionsAccepted}
          shouldShow={showMHVTermsAndConditions}
        >
          <List.HeadingComplete>
            Review terms and conditions
          </List.HeadingComplete>

          <List.ContentComplete>
            <p className="vads-u-margin-y--0">
              You’ve accepted the terms and conditions for using VA.gov health
              tools
            </p>
            <a
              href={termsAndConditionsUrl}
              onClick={() =>
                recordEvent({
                  event: 'profile-navigation',
                  'profile-action': 'view-link',
                  'profile-section': 'terms',
                })
              }
            >
              View terms and conditions for medical information
            </a>
          </List.ContentComplete>

          {mhvAccount.accountState === 'needs_terms_acceptance' && (
            <>
              <List.HeadingIncomplete>
                <a
                  href={termsAndConditionsUrl}
                  onClick={() =>
                    recordEvent({
                      event: 'profile-navigation',
                      'profile-action': 'view-link',
                      'profile-section': 'terms',
                    })
                  }
                >
                  Review terms and conditions
                </a>
              </List.HeadingIncomplete>

              <List.ContentIncomplete>
                Before using our health tools, you’ll need to read and agree to
                the terms and conditions for medical information. This will give
                us permission to share your VA medical information with you.
                Once you do this, you can use the tools to refill your VA
                prescriptions or download your VA health records.
              </List.ContentIncomplete>
            </>
          )}
        </List.Item>
      </List>
    </section>
  );
};

AccountSetupTable.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
  mhvAccount: PropTypes.shape({
    termsAndConditionsAccepted: PropTypes.bool.isRequired,
    accountState: PropTypes.string.isRequired,
  }).isRequired,
  showMHVTermsAndConditions: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export const AccountSecurityTables = ({
  signInServiceName,
  isIdentityVerified,
  isMultifactorEnabled,
  showMHVTermsAndConditions,
  mhvAccount,
}) => {
  return (
    <>
      {/* legacy toble view for email address table */}
      <ProfileInfoTable
        title="Sign in information"
        level={2}
        data={[
          {
            value: (
              <EmailAddressNotification signInServiceName={signInServiceName} />
            ),
          },
        ]}
        className="vads-u-margin-bottom--2"
      />

      <AccountSetupTable
        title="Account setup"
        isIdentityVerified={isIdentityVerified}
        isMultifactorEnabled={isMultifactorEnabled}
        showMHVTermsAndConditions={showMHVTermsAndConditions}
        mhvAccount={mhvAccount}
      />
    </>
  );
};

AccountSecurityTables.propTypes = {
  isIdentityVerified: PropTypes.bool.isRequired,
  isMultifactorEnabled: PropTypes.bool.isRequired,
  mhvAccount: PropTypes.shape({
    termsAndConditionsAccepted: PropTypes.bool,
    accountState: PropTypes.string,
  }).isRequired,
  showMHVTermsAndConditions: PropTypes.bool.isRequired,
  signInServiceName: PropTypes.string.isRequired,
};
