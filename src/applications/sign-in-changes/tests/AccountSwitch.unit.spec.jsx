import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import AccountSwitch from '../components/AccountSwitch';

const mockStore = {
  getState: () => ({ user: { profile: { session: { authBroker: 'iam' } } } }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('AccountSwitch', () => {
  it('renders Login.gov when there is a logingov user email', () => {
    const screen = render(
      <Provider store={mockStore}>
        <AccountSwitch userEmails={{ logingov: 'test@example.com' }} />
      </Provider>,
    );
    const loginGovButton = screen.getByRole('button', {
      'data-csp': /'logingov'/i,
    });
    expect(loginGovButton).to.not.be.null;
    expect(
      screen.getAllByRole('heading', { level: 2 })[0].textContent,
    ).to.include('Start using your Login.gov account now');
    expect(screen.getByTestId('email-mask').textContent).to.include(
      'tes*@example.com',
    );
  });

  it('renders ID.me when there is a idme user email', () => {
    const screen = render(
      <Provider store={mockStore}>
        <AccountSwitch userEmails={{ idme: 'test@example.com' }} />
      </Provider>,
    );
    const idmeButton = screen.getByRole('button', {
      'data-csp': /'idme'/i,
    });
    expect(idmeButton).to.not.be.null;
    expect(
      screen.getAllByRole('heading', { level: 2 })[0].textContent,
    ).to.include('Start using your ID.me account now');
  });

  it('renders both Login.gov and ID.me when both emails are provided', () => {
    const screen = render(
      <Provider store={mockStore}>
        <AccountSwitch
          userEmails={{
            logingov: 'logi@example.com',
            idme: 'idme@example.com',
          }}
        />
      </Provider>,
    );

    expect(screen.getAllByRole('button').length).to.eql(2);
    expect(
      screen.getByText((content, element) => {
        const hasText = /Start using your account now/i.test(content);
        const isHeading = element.tagName.toLowerCase() === 'h2';
        return hasText && isHeading;
      }),
    ).to.exist;

    const [logingov, idme] = screen.getAllByTestId('email-mask');

    expect(logingov.textContent).to.include('log*@example.com');
    expect(idme.textContent).to.include('idm*@example.com');
  });
});
