import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import viewifyFields from '../../../src/js/utilities/viewify-fields';
import { PaymentView } from '../../../src/js/components/PaymentView';

describe('PaymentView', () => {
  // The form data for just this bankAccount object, not the whole form
  const formData = () => ({
    accountType: 'checking',
    accountNumber: '0987654321',
    routingNumber: '123456789',
    bankName: 'Gringotts',
  });
  it('should render only original data', () => {
    const view = render(
      <PaymentView originalData={viewifyFields(formData())} />,
    );

    view.getByText(
      'This is the bank account information we have on file for you. This is where we’ll send your payments.',
    );
    view.getByText('Checking Account');
    expect(view.getByTestId('account-number').textContent).to.equal(
      'Account number: ●●●●●●ending with4321',
    );
    expect(view.getByTestId('routing-number').textContent).to.equal(
      'Bank routing number: ●●●●●ending with6789',
    );
    expect(view.getByTestId('bank-name').textContent).to.equal(
      'Bank name: Gringotts',
    );
  });

  it('should render only form data', () => {
    const view = render(<PaymentView formData={formData()} />);

    expect(
      view.queryByText(
        'We’re currently paying your compensation to this account',
      ),
    ).to.be.null;
    view.getByText('Checking Account');
    expect(view.getByTestId('account-number').textContent).to.equal(
      'Account number: ●●●●●●ending with4321',
    );
    expect(view.getByTestId('routing-number').textContent).to.equal(
      'Bank routing number: ●●●●●ending with6789',
    );
    expect(view.getByTestId('bank-name').textContent).to.equal(
      'Bank name: Gringotts',
    );
  });

  it('should render the changed data', () => {
    const view = render(
      <PaymentView
        formData={{
          accountType: 'savings',
          accountNumber: '1111111111',
          routingNumber: '333333333',
          bankName: 'Boring bank',
        }}
        originalData={viewifyFields(formData)}
      />,
    );

    expect(
      view.queryByText(
        'We’re currently paying your compensation to this account',
      ),
    ).to.be.null;
    view.getByText('Savings Account');
    expect(view.getByTestId('account-number').textContent).to.equal(
      'Account number: ●●●●●●ending with1111',
    );
    expect(view.getByTestId('routing-number').textContent).to.equal(
      'Bank routing number: ●●●●●ending with3333',
    );
    expect(view.getByTestId('bank-name').textContent).to.equal(
      'Bank name: Boring bank',
    );
  });
});
