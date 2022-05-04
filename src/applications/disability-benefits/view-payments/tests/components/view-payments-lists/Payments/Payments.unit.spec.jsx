import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { payments } from '../../../helpers';
import {
  paymentsReceivedFields,
  paymentsReceivedContent,
} from '../../../../components/view-payments-lists/helpers';
import Payments from '../../../../components/view-payments-lists/payments/Payments';

describe('<Payments />', () => {
  it('should render with a list of payments', async () => {
    const screen = render(
      <Payments
        fields={paymentsReceivedFields}
        data={payments.payments}
        tableVersion="received"
        textContent={paymentsReceivedContent}
      />,
    );

    expect(await screen.findByText(/Payments you received/)).to.exist;
    expect(await screen.findByText(/Date/)).to.exist;
    expect(await screen.findByText(/Amount/)).to.exist;
    expect(await screen.findByText(/Type/)).to.exist;
  });

  it('should render an error if the payments list is empty', async () => {
    const mockEmptyPayments = [];
    const screen = render(
      <Payments
        data={mockEmptyPayments}
        fields={paymentsReceivedFields}
        tableVersion="received"
        textContent={paymentsReceivedContent}
      />,
    );

    expect(await screen.findByText(/No received payments/)).to.exist;
  });
});
