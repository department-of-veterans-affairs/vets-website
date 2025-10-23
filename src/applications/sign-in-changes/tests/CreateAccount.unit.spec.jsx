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
    const { getByText } = render(
      <Provider store={store}>
        <CreateAccount />
      </Provider>,
    );

    expect(getByText(/Create a different account now/i)).to.exist;
    expect(getByText(/Create an identity-verified/i)).to.exist;
  });

  it('renders two LoginButton components with correct csp prop', () => {
    const store = generateStore();
    const { getAllByRole } = render(
      <Provider store={store}>
        <CreateAccount />
      </Provider>,
    );

    const buttons = getAllByRole('button');
    expect(buttons).to.have.lengthOf(2);
  });
});
