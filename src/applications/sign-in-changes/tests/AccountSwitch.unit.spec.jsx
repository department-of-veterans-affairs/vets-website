import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import AccountSwitch from '../components/AccountSwitch';
import { maskEmail } from '../helpers';

const mockStore = configureStore([]);

describe('AccountSwitch', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it('renders', () => {
    const mockEmail = 'test@example.com';

    render(
      <Provider store={store}>
        <AccountSwitch hasLogingov userEmail={mockEmail} />
      </Provider>,
    );

    expect(screen.getByText(/Switch to your Login.gov account now/i)).to.be
      .true;
    expect(screen.getByText(/We found an existing Login.gov account/i)).to.be
      .true;
    expect(maskEmail).toHaveBeenCalledWith(mockEmail);
  });

  it('renders Login.gov when hasLogingov is true', () => {
    const mockEmail = 'test@example.com';

    render(
      <Provider store={store}>
        <AccountSwitch hasLogingov userEmail={mockEmail} />
      </Provider>,
    );
    expect(screen.getByRole('button', { name: /Login/i })).to.be.true;
  });

  it('renders ID.me when hasLogingov is false', () => {
    const mockEmail = 'test@example.com';

    render(
      <Provider store={store}>
        <AccountSwitch hasLogingov={false} userEmail={mockEmail} />
      </Provider>,
    );

    expect(screen.getByText(mockEmail)).to.be.true;
    expect(screen.getByRole('button', { name: /ID.me/i })).to.be.true;
  });
});
