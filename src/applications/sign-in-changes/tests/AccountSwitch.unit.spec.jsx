import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import AccountSwitch from '../components/AccountSwitch';

const mockStore = {
  getState: () => {
    return {
      user: {
        profile: {
          email: 'test@example.com',
        },
      },
    };
  },
  subscribe: () => {},
  dispatch: () => {},
};

describe('AccountSwitch', () => {
  it('renders Login.gov when hasLogingov is true', () => {
    const screen = render(
      <Provider store={mockStore}>
        <AccountSwitch hasLogingov />
      </Provider>,
    );
    const loginGovButton = screen.getByRole('button', {
      'data-csp': /'logingov'/i,
    });
    expect(loginGovButton).to.not.be.null;
    expect(screen.getByRole('heading', { level: 2 }).textContent).to.include(
      'Start using your Login.gov account now',
    );
    expect(screen.getByText('tes*@example.com')).to.exist;
  });

  it('renders ID.me when hasLogingov is false', () => {
    const screen = render(
      <Provider store={mockStore}>
        <AccountSwitch hasLogingov={false} />
      </Provider>,
    );
    const idmeButton = screen.getByRole('button', {
      'data-csp': /'idme'/i,
    });
    expect(idmeButton).to.not.be.null;
    expect(screen.getByRole('heading', { level: 2 }).textContent).to.include(
      'Start using your ID.me account now',
    );
  });
});
