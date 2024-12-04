import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import VerifyApp from '../../containers/VerifyApp';

const generateStore = ({
  csp = 'logingov',
  verified = false,
  loading = false,
} = {}) => ({
  getState: () => ({
    user: {
      profile: {
        loading,
        signIn: { serviceName: csp },
        verified,
        session: { authBroker: 'iam' },
      },
    },
  }),
  dispatch: () => {},
  subscribe: () => {},
});

describe('VerifyApp', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders VerifyApp', () => {
    const store = generateStore();
    window.localStorage.setItem('hasSession', true);
    const { getByTestId } = render(
      <Provider store={store}>
        <VerifyApp />
      </Provider>,
    );

    expect(getByTestId('verify-app')).to.exist;
  });

  it('renders loading indicator when app is loading', () => {
    const store = generateStore({ loading: true });
    window.localStorage.setItem('hasSession', true);

    const { container } = render(
      <Provider store={store}>
        <VerifyApp />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.exist;
  });

  ['dslogon', 'mhv'].forEach(csp => {
    it('displays both identity verification buttons for mhv & dslogon users', () => {
      const store = generateStore({ csp });
      window.localStorage.setItem('hasSession', true);
      const { getByTestId, container } = render(
        <Provider store={store}>
          <VerifyApp />
        </Provider>,
      );

      expect(getByTestId('verify-button-group').children.length).to.equal(2);
      expect($(`.logingov-verify-button`, container)).to.exist;
      expect($(`.idme-verify-button`, container)).to.exist;
    });
  });

  ['idme', 'logingov'].forEach(csp => {
    it(`should display one ${csp} verification button for ${csp} users`, () => {
      const store = generateStore({ csp });
      window.localStorage.setItem('hasSession', true);
      const { container } = render(
        <Provider store={store}>
          <VerifyApp />
        </Provider>,
      );
      const cspVerifyButton = $(`.${csp}-verify-button`, container);
      expect(cspVerifyButton).to.exist;
    });
  });

  it('should redirect to home page when user is using a verified account', () => {
    window.localStorage.setItem('hasSession', false);
    const store = generateStore({ loading: false, verified: true });
    const wrapper = render(
      <Provider store={store}>
        <VerifyApp />
      </Provider>,
    );

    expect(wrapper.findByTestId('loading-indicator'));
    wrapper.unmount();
  });
});
