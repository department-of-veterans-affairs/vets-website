import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { payments } from '../helpers';
import {
  paymentsReceivedFields,
  paymentsReceivedContent,
} from '../../../../components/view-payments-lists/helpers';
import Payments from '../../../../components/view-payments-lists/payments/Payments';
/**
 * Test Cases
 * 1. Component should render
 * 2. paginatedData
 *    - should not be empty when there are payments
 *    - should be empty when there are no payments
 * 3. State should update on pagination
 */

// Props - fields, data, textContent

describe('<Payments />', () => {
  it('should render', async () => {
    const screen = render(
      <Payments
        fields={paymentsReceivedFields}
        data={payments.payments}
        textContent={paymentsReceivedContent}
      />,
    );

    expect(await screen.findByText(/Payments you received/)).to.exist;
  });
});
