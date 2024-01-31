import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { within } from '@testing-library/dom';
import { oneDayAgo } from '@@profile/tests/helpers';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import PaymentsCard from '../../../components/benefit-payments/PaymentsCard';

describe('<PaymentsCard />', () => {
  const payment = {
    payCheckAmount: '$3,261.10',
    payCheckDt: oneDayAgo(),
    payCheckId: '001',
    payCheckReturnFiche: 'C',
    payCheckType: 'Compensation & Pension - Recurring',
    paymentMethod: ' Direct Deposit',
    bankName: 'NAVY FEDERAL CREDIT UNION',
    accountNumber: '****1234',
  };

  it('should render the payment card', () => {
    const view = renderWithStoreAndRouter(
      <PaymentsCard lastPayment={payment} />,
      { initialState: {} },
    );

    expect(view.getByTestId('payment-card')).to.exist;

    const depositHeader = view.getByTestId('deposit-header');
    expect(within(depositHeader).getByText(/\+.*\$3,261\.10/)).to.exist;
    expect(view.getByText(/Compensation & Pension - Recurring/i)).to.exist;
    const depositedOn = `Deposited on ${format(
      payment.payCheckDt,
      'MMMM d, yyyy',
    )}`;
    expect(view.getByText(depositedOn, { exact: false })).to.exist;
    expect(view.getByTestId('payment-card-view-history-link')).to.exist;
  });

  it('should render the check mailed text', () => {
    const pmt = { ...payment, paymentMethod: 'Paper Check' };
    const view = renderWithStoreAndRouter(<PaymentsCard lastPayment={pmt} />, {
      initialState: {},
    });

    const mailedOn = `Check mailed on ${format(
      payment.payCheckDt,
      'MMMM d, yyyy',
    )}`;
    expect(view.getByText(mailedOn, { exact: false })).to.exist;
  });
});
