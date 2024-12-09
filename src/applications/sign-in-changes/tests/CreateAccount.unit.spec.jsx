import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import CreateAccount from '../components/CreateAccount';

const generateStore = () => ({
  getState: () => ({ user: { profile: { session: { authBroker: 'iam' } } } }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('CreateAccount', () => {
  it('renders the static content correctly', () => {
    const store = generateStore();
    const screen = render(
      <Provider store={store}>
        <CreateAccount />
      </Provider>,
    );

    expect(screen.getByText(/Create a different account now/i)).to.exist;

    expect(screen.getByText(/Create an identity-verified/i)).to.exist;
  });

  it('renders two LoginButton components with correct csp prop', () => {
    const store = generateStore();
    const screen = render(
      <Provider store={store}>
        <CreateAccount />
      </Provider>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).to.have.lengthOf(2);
  });
});
