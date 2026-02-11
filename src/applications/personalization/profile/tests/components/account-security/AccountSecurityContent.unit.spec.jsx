import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { Toggler } from '~/platform/utilities/feature-toggles';
import * as mfaImport from '~/platform/user/authentication/utilities';
import AccountSecurityContent from '../../../components/account-security/AccountSecurityContent';
import {
  createCustomProfileState,
  createFeatureTogglesState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';

describe('AccountSecurityContent component', () => {
  beforeEach(() => {
    sinon.stub(mfaImport, 'mfa').callsFake(() => {});
  });

  afterEach(() => {
    cleanup();
    mfaImport.mfa?.restore();
  });

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

  it('renders <AccountBlocked /> when isBlocked is true', () => {
    const { getByTestId } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            directDeposit: {
              controlInformation: {
                isCompetent: false,
              },
            },
          }),
        },
      },
    );

    expect(getByTestId('account-blocked-alert')).to.exist;
  });

  it('renders <MPIConnectionError /> when user profile status is SERVER_ERROR', () => {
    const { getByTestId } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                loa: { current: 3 },
                status: 'SERVER_ERROR',
              },
            },
          }),
        },
      },
    );

    expect(getByTestId('mpi-connection-error')).to.exist;
  });

  it("renders <SignInServiceUpdateLink /> when identity isn't verified and profile2 is enabled", () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                loa: { current: 1 },
              },
            },
          }),
          ...createFeatureTogglesState({
            [Toggler.TOGGLE_NAMES.profile2Enabled]: true,
          }),
        },
      },
    );

    expect(getByText('Update your sign-in information on the ID.me website')).to
      .exist;
  });

  it('renders 2-factor authentication notice when multifactor is false', async () => {
    const view = renderWithProfileReducersAndRouter(
      <AccountSecurityContent />,
      {
        initialState: {
          ...createCustomProfileState({
            user: {
              profile: {
                loa: { current: 3 },
                multifactor: false,
              },
            },
          }),
          ...createFeatureTogglesState({
            [Toggler.TOGGLE_NAMES.profile2Enabled]: true,
          }),
        },
      },
    );

    expect(
      view.getByText(/Add an extra layer of protection called multifactor/),
    ).to.exist;
    const button = view.container.querySelector('va-button', {
      text: /Sign in again through ID\.me to get started/,
    });
    expect(button).to.exist;
    button.click();
    await waitFor(() => {
      expect(mfaImport.mfa.called).to.be.true;
    });
  });
});
