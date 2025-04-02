import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import AccountSwitch from '../components/AccountSwitch';

const mockStore = {
  getState: () => ({ user: { profile: { session: { authBroker: 'iam' } } } }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('AccountSwitch', () => {
  it('renders Login.gov when there is a logingov user email', () => {
    const { getByText, container, getByTestId } = render(
      <Provider store={mockStore}>
        <AccountSwitch userEmails={{ logingov: 'test@example.com' }} />
      </Provider>,
    );

    const loginGovButton = $('.logingov-verify-buttons', container);
    expect(loginGovButton).to.exist;

    const heading = getByText(/Start using your/i);
    expect(heading).to.exist;

    const maskedEmail = getByTestId('logingovemail');
    expect(maskedEmail).to.exist;
  });

  it('renders ID.me when there is an idme user email', () => {
    const { getByText, container, getByTestId } = render(
      <Provider store={mockStore}>
        <AccountSwitch userEmails={{ idme: 'test@example.com' }} />
      </Provider>,
    );

    const idmeButton = $('.idme-verify-buttons', container);
    expect(idmeButton).to.exist;

    const heading = getByText(/Start using your/i);
    expect(heading).to.exist;

    const maskedEmail = getByTestId('idmeemail');
    expect(maskedEmail).to.exist;
  });

  it('renders both Login.gov and ID.me when both emails are provided', () => {
    const { getAllByRole, getByText, container, getByTestId } = render(
      <Provider store={mockStore}>
        <AccountSwitch
          userEmails={{
            logingov: 'logi@example.com',
            idme: 'idme@example.com',
          }}
        />
      </Provider>,
    );

    const buttons = getAllByRole('button');
    expect(buttons.length).to.eql(2);

    const logingovButton = $('.logingov-verify-buttons', container);
    expect(logingovButton).to.exist;

    const idmeButton = $('.idme-verify-buttons', container);
    expect(idmeButton).to.exist;

    const heading = getByText(/Start using your/i);
    expect(heading).to.exist;

    const logingovMaskedEmail = getByTestId('logingovemail');
    expect(logingovMaskedEmail).to.exist;

    const idmeMaskedEmail = getByTestId('idmeemail');
    expect(idmeMaskedEmail).to.exist;
  });
});
