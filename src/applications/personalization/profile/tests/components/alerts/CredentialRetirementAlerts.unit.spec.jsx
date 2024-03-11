import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import {
  createCustomProfileState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';
import { CSP_IDS } from '~/platform/user/authentication/constants';

import {
  AccountSecurityLoa1CredAlert,
  SignInEmailAlert,
} from '../../../components/alerts/CredentialRetirementAlerts';

describe('AccountSecurityLoa1CredAlert', () => {
  afterEach(cleanup);

  it('renders alert with DS_LOGON service provider in text', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurityLoa1CredAlert />,
      {
        initialState: createCustomProfileState({
          user: { profile: { signIn: { serviceName: CSP_IDS.DS_LOGON } } },
        }),
      },
    );

    expect(
      getByText('sign in with your DS Logon username and password', {
        exact: false,
      }),
    ).to.exist;
  });

  it('renders alert with MHV service provider in text', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurityLoa1CredAlert />,
      {
        initialState: createCustomProfileState({
          user: { profile: { signIn: { serviceName: CSP_IDS.MHV } } },
        }),
      },
    );

    expect(
      getByText('sign in with your My HealtheVet username and password', {
        exact: false,
      }),
    ).to.exist;
  });
});

describe('SignInEmailAlert', () => {
  afterEach(cleanup);

  it('renders alert with DS_LOGON service provider in text', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <SignInEmailAlert />,
      {
        initialState: createCustomProfileState({
          user: { profile: { signIn: { serviceName: CSP_IDS.DS_LOGON } } },
        }),
      },
    );

    expect(
      getByText('sign in with your DS Logon username and password', {
        exact: false,
      }),
    ).to.exist;
  });

  it('renders alert with MHV service provider in text', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <SignInEmailAlert />,
      {
        initialState: createCustomProfileState({
          user: { profile: { signIn: { serviceName: CSP_IDS.MHV } } },
        }),
      },
    );

    expect(
      getByText('sign in with your My HealtheVet username and password', {
        exact: false,
      }),
    ).to.exist;
  });
});
