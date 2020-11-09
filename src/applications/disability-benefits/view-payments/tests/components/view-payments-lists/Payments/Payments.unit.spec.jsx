import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
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
        tableVersion="received"
        fields={paymentsReceivedFields}
        data={mockEmptyPayments}
        textContent={paymentsReceivedContent}
      />,
    );

    expect(await screen.findByText(/No received payments/)).to.exist;
  });

  it('should update the display numbers when paginating', async () => {
    const screen = render(
      <Payments
        fields={paymentsReceivedFields}
        data={payments.payments}
        textContent={paymentsReceivedContent}
      />,
    );
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => expect(screen.getByText(/Displaying 7 - 9 of 9/)));
    fireEvent.click(screen.getByText('Prev'));
    await waitFor(() => expect(screen.getByText(/Displaying 1 - 6 of 9/)));
  });
});
