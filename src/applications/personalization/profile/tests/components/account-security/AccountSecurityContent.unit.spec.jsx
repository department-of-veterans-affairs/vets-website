import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import AccountSecurityContent from '../../../components/account-security/AccountSecurityContent';
import {
  createCustomProfileState,
  createFeatureTogglesState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

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
                signIn: { serviceName: CSP_IDS.DS_LOGON },
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

  it('renders credential retirement alert when using DS Logon signIn.serviceName', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                signIn: { serviceName: CSP_IDS.DS_LOGON },
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
      'heading for alert exists when DS Logon is used',
    ).to.exist;

    expect(
      getByText(
        'Starting December 31, 2024, you’ll no longer be able to sign in with your DS Logon username and password.',
        {
          exact: false,
        },
      ),
      'content for alert exists when DS Logon is used',
    ).to.exist;
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
        'Starting December 31, 2024, you’ll no longer be able to sign in with your My HealtheVet username and password.',
        {
          exact: false,
        },
      ),
      'content for alert exists when MHV is used',
    ).to.exist;
  });

  it('renders regular identity not verified alert when user is not verified and id.me', () => {
    const { getByText, container } = renderWithProfileReducersAndRouter(
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

    expect(
      getByText('Verify your identity to access your complete profile'),
      'heading for alert exists when user is not verified',
    ).to.exist;

    const alert = container.querySelector('va-alert');
    expect(
      within(alert).getByRole('link', { name: 'Verify your identity' }),
      'verify identity link exists when user is not verified',
    ).to.exist;
  });
});
