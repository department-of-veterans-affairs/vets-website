import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import AuthenticatedVerify from '../../components/AuthenticatedVerify';

const generateStore = ({
  csp = 'logingov',
  verified = false,
  loading = false,
} = {}) => ({
  user: {
    profile: {
      loading,
      signIn: { serviceName: csp },
      verified,
      session: { authBroker: 'iam' },
    },
  },
});

describe('AuthenticatedVerify', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders AuthenticatedVerify component', () => {
    const initialState = generateStore();
    window.localStorage.setItem('hasSession', true);
    const { getByTestId } = renderInReduxProvider(<AuthenticatedVerify />, {
      initialState,
    });

    expect(getByTestId('authenticated-verify-app')).to.exist;
  });

  it('renders loading indicator when profile is loading', () => {
    const initialState = generateStore({ loading: true });
    window.localStorage.setItem('hasSession', true);

    const { container } = renderInReduxProvider(<AuthenticatedVerify />, {
      initialState,
    });

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.exist;
  });

  ['mhv', 'dslogon'].forEach(csp => {
    it(`displays both Login.gov and ID.me buttons for ${csp} users`, () => {
      const initialState = generateStore({ csp });
      const { getByTestId } = renderInReduxProvider(<AuthenticatedVerify />, {
        initialState,
      });

      const buttonGroup = getByTestId('verify-button-group');
      expect(buttonGroup.children.length).to.equal(2);
    });
  });

  ['logingov', 'idme'].forEach(csp => {
    it(`displays single verification button for ${csp} users`, () => {
      const initialState = generateStore({ csp });
      const { container } = renderInReduxProvider(<AuthenticatedVerify />, {
        initialState,
      });

      const cspVerifyButton = $(`.${csp}-verify-button`, container);
      expect(cspVerifyButton).to.exist;
    });
  });

  it('displays deprecation notice for mhv users', () => {
    const initialState = generateStore({ csp: 'mhv' });
    const { container } = renderInReduxProvider(<AuthenticatedVerify />, {
      initialState,
    });

    expect(container.textContent).to.include(
      'You’ll need to sign in with a different account after January 31, 2025.',
    );
  });

  it('displays deprecation notice for dslogon users', () => {
    const initialState = generateStore({ csp: 'dslogon' });
    const { container } = renderInReduxProvider(<AuthenticatedVerify />, {
      initialState,
    });

    expect(container.textContent).to.include(
      'You’ll need to sign in with a different account after September 30, 2025.',
    );
  });
});
