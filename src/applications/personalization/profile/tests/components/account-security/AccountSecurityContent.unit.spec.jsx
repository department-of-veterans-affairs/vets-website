import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { Toggler } from '~/platform/utilities/feature-toggles';
import AccountSecurityContent from '../../../components/account-security/AccountSecurityContent';
import {
  createCustomProfileState,
  createFeatureTogglesState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';

describe('AccountSecurityContent component', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                signIn: { serviceName: CSP_IDS.ID_ME },
                loa: { current: 1 },
              },
            },
          }),
          ...createFeatureTogglesState({
            [Toggler.TOGGLE_NAMES
              .profileShowCredentialRetirementMessaging]: true,
          }),
        },
      },
    );

    expect(getByText('Sign-in information')).to.exist;
    expect(getByText('Account setup')).to.exist;
  });

  it('renders credential retirement alert when using MHV signIn.serviceName', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                signIn: { serviceName: CSP_IDS.MHV },
                loa: { current: 1 },
              },
            },
          }),
          ...createFeatureTogglesState({
            [Toggler.TOGGLE_NAMES
              .profileShowCredentialRetirementMessaging]: true,
          }),
        },
      },
    );

    expect(
      getByText(
        'Verify your identity with Login.gov or ID.me to manage your profile information',
        {
          exact: false,
        },
      ),
      'heading for alert exists when MHV is used',
    ).to.exist;

    expect(
      getByText(
        'Starting January 31, 2025, you’ll no longer be able to sign in with your My HealtheVet username and password.',
        {
          exact: false,
        },
      ),
      'content for alert exists when MHV is used',
    ).to.exist;
  });

  it('renders regular identity not verified alert when user is not verified and id.me', () => {
    const { container } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                signIn: { serviceName: CSP_IDS.ID_ME },
                loa: { current: 1 },
              },
            },
          }),
          ...createFeatureTogglesState({
            [Toggler.TOGGLE_NAMES
              .profileShowCredentialRetirementMessaging]: false,
          }),
        },
      },
    );

    const alert = container.querySelector('va-alert-sign-in');
    expect(alert).to.exist;
    expect(alert.getAttribute('variant')).to.eql('verifyIdMe');
  });
});
