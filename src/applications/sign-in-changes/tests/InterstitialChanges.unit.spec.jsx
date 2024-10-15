import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import InterstitialChanges from '../containers/InterstitialChanges';

const generateStore = ({
  signInChangesEnabled = true,
  email = 'test@example.com',
  logingovUuid = null,
  idmeUuid = null,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      sign_in_changes_enabled: signInChangesEnabled,
    },
    user: {
      profile: {
        email,
        logingovUuid,
        idmeUuid,
      },
    },
  }),
  subscribe: sinon.stub(),
  dispatch: () => {},
});

describe('InterstitialChanges', () => {
  it('renders the static content correctly', () => {
    const store = generateStore();
    const expectedReturnUrl = '/';
    const screen = render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        name: /You’ll need to sign in with a different account after January 31, 2025/i,
      }),
    ).to.exist;
    expect(screen.getByText(/After this date, we'll remove/i)).to.exist;
    expect(
      screen.container.querySelector(
        'va-link[text="Continue with your My HealtheVet account for now"]',
      ),
    ).to.have.attribute('href', expectedReturnUrl);
  });

  it('renders AccountSwitch when user has Login.gov account', () => {
    const store = generateStore({
      logingovUuid: 'some-logingov-uuid',
    });
    const screen = render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );

    expect(screen.getByText(/Start using your/i)).to.exist;
    expect(screen.getByText(/tes\*@example.com/i)).to.exist;
  });
  it('renders AccountSwitch when user has ID.me account', () => {
    const store = generateStore({
      idmeUuid: 'jsdkfhgkjhk',
    });
    const screen = render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(screen.getByText(/Start using your/i)).to.exist;
    expect(screen.getByText(/tes\*@example.com/i)).to.exist;
  });

  it('uses the correct returnUrl from sessionStorage', () => {
    const store = generateStore();
    const expectedReturnUrl = 'continue-url';
    sessionStorage.setItem('authReturnUrl', expectedReturnUrl);
    const screen = render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        name: /You’ll need to sign in with a different account after/i,
      }),
    ).to.exist;
    expect(screen.getByText(/After this date, we'll remove/i)).to.exist;
    expect(
      screen.container.querySelector(
        'va-link[text="Continue with your My HealtheVet account for now"]',
      ),
    ).to.have.attribute('href', expectedReturnUrl);
    sessionStorage.clear();
  });
});
