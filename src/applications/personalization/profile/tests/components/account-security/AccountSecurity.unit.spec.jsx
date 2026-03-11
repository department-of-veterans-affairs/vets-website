import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import AccountSecurity from '../../../components/account-security/AccountSecurity';
import {
  createCustomProfileState,
  renderWithProfileReducersAndRouter,
} from '../../unit-test-helpers';

describe('AccountSecurity Page', () => {
  afterEach(cleanup);

  it('renders without crashing', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurity />,
      {
        initialState: createCustomProfileState(),
      },
    );
    expect(getByText('Account security')).to.exist;
  });

  it('sets the document title on mount', () => {
    renderWithProfileReducersAndRouter(<AccountSecurity />, {
      initialState: createCustomProfileState(),
    });
    expect(document.title).to.equal('Account security | Veterans Affairs');
  });

  it('renders main section headings of account security page', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurity />,
      {
        initialState: createCustomProfileState(),
      },
    );

    expect(getByText('Sign-in information')).to.exist;
    expect(getByText('Account setup')).to.exist;
  });

  it('shows the correct headline text when profile2Enabled toggle is on', () => {
    const { getByText } = renderWithProfileReducersAndRouter(
      <AccountSecurity />,
      {
        initialState: createCustomProfileState({
          featureToggles: {
            profile2Enabled: true,
          },
        }),
      },
    );
    expect(getByText('Sign-in information')).to.exist;
  });
});
