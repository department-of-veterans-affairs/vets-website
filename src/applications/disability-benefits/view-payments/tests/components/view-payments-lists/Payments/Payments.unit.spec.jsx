import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
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
      { wrapper: MemoryRouter },
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
      { wrapper: MemoryRouter },
    );

    expect(await screen.findByText(/No received payments/)).to.exist;
  });

  const getPageFromURL = location => {
    return new URLSearchParams(location.search).get('page') || 1;
  };
  it('should correctly parse the page number from the URL', () => {
    const location = {
      pathname: '/',
      search: '?page=3',
    };

    render(
      <MemoryRouter initialEntries={[location]}>
        <Payments
          fields={paymentsReceivedFields}
          data={payments.payments}
          tableVersion="received"
          textContent={paymentsReceivedContent}
          location={location} // Pass location to Payments component
        />
      </MemoryRouter>,
    );

    const page = getPageFromURL(location);
    expect(page).to.equal('3');
  });

  it('should default to page 1 when no page param is provided', () => {
    const location = {
      pathname: '/',
      search: '',
    };

    render(
      <MemoryRouter initialEntries={[location]}>
        <Payments
          fields={paymentsReceivedFields}
          data={payments.payments}
          tableVersion="received"
          textContent={paymentsReceivedContent}
          location={location} // Pass location to Payments component
        />
      </MemoryRouter>,
    );
    const page = getPageFromURL(location);
    expect(page).to.equal(1);
  });
});
