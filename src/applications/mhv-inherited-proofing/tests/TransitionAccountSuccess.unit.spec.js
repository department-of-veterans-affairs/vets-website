import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import TransitionAccountSuccess from 'applications/mhv-inherited-proofing/components/TransitionAccountSuccess';

import configureStore from 'redux-mock-store';

// export const SERVICE_PROVIDERS = {
//   logingov: { label: 'Login.gov', link: 'https://secure.login.gov/account' },
//   idme: { label: 'ID.me', link: 'https://wallet.id.me/settings' },
// };

// selectProfile(state).signIn?.serviceName;

describe('TransitionAccountSuccess', () => {
  let store;
  let tree;
  const middleware = [];
  const mockStore = configureStore(middleware);
  const initState = {
    user: {
      login: {
        currentlyLoggedIn: true,
        hasCheckedKeepAlive: true,
      },
      profile: {
        signIn: {
          serviceName: 'logingov',
        },
      },
    },
  };
  beforeEach(() => {
    store = mockStore(initState);

    tree = render(
      <Provider store={store}>
        <TransitionAccountSuccess />
      </Provider>,
    );
  });

  it('should render', () => {
    expect(tree.getByTestId('header')).to.exist;

    expect(tree.getByTestId('header')).to.have.text(
      'Account transfer is complete',
    );

    tree.unmount();
  });

  it('should render when `signInServiceName` is `logingov`', () => {
    expect(tree.getByTestId('transfered_CSP')).to.exist;

    expect(tree.getByTestId('transfered_CSP')).to.have.text(
      'Some text to compare',
    );

    tree.unmount();
  });
});
