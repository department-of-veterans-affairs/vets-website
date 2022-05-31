import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import TransitionAccountSuccess from 'applications/mhv-inherited-proofing/components/TransitionAccountSuccess';

import configureStore from 'redux-mock-store';

describe('TransitionAccountSuccess', () => {
  let store;
  let tree;
  const middleware = [];
  const mockStore = configureStore(middleware);

  it('should render', () => {
    const initState = {
      user: {
        profile: {
          signIn: {
            serviceName: 'logingov',
          },
        },
      },
    };
    store = mockStore(initState);

    tree = render(
      <Provider store={store}>
        <TransitionAccountSuccess />
      </Provider>,
    );

    expect(tree.getByTestId('header')).to.exist;

    expect(tree.getByTestId('header')).to.have.text(
      'Account transfer is complete',
    );

    tree.unmount();
  });

  it('should render when `signInServiceName` is `logingov`', () => {
    const initState = {
      user: {
        profile: {
          signIn: {
            serviceName: 'logingov',
          },
        },
      },
    };
    store = mockStore(initState);

    tree = render(
      <Provider store={store}>
        <TransitionAccountSuccess />
      </Provider>,
    );

    expect(tree.getByTestId('transfered_CSP')).to.exist;

    expect(tree.getByTestId('transfered_CSP')).to.have.text('Login.gov');

    tree.unmount();
  });

  it('should render when `signInServiceName` is `idme`', () => {
    const initState = {
      user: {
        profile: {
          signIn: {
            serviceName: 'idme',
          },
        },
      },
    };
    store = mockStore(initState);

    tree = render(
      <Provider store={store}>
        <TransitionAccountSuccess />
      </Provider>,
    );

    expect(tree.getByTestId('transfered_CSP')).to.exist;

    expect(tree.getByTestId('transfered_CSP')).to.have.text('ID.me');

    tree.unmount();
  });
});
