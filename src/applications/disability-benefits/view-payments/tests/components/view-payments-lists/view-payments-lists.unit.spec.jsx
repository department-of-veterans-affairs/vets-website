import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom-v5-compat';
import ViewPaymentsLists from '../../../components/view-payments-lists/ViewPaymentsLists';
import { payments, emptyPaymentsReceived } from '../../helpers';

describe('View Payments Lists', () => {
  const receivedPayments = payments.payments || payments.returnPayments || [];

  it('renders View Payments Lists component with both tables', async () => {
    const initialState = {
      allPayments: {
        isLoading: false,
        payments: {
          returnPayments: payments.returnPayments || [],
          payments: receivedPayments,
        },
        error: false,
      },
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const reducers = {
      allPayments: (state = initialState.allPayments) => state,
    };
    const screen = renderWithStoreAndRouter(
      <MemoryRouter>
        <ViewPaymentsLists getAllPayments={() => {}} />
      </MemoryRouter>,
      { initialState, reducers },
    );
    expect(await screen.findByText(/Payments you received/)).to.exist;
    expect(screen.getByText(/Payments returned/)).to.exist;
  });

  it('should render a payments received table and handle an empty payments returned table', async () => {
    const initialState = {
      allPayments: {
        isLoading: false,
        payments: { returnPayments: [], payments: receivedPayments },
        error: false,
      },
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const reducers = {
      allPayments: (state = initialState.allPayments) => state,
    };
    const screen = renderWithStoreAndRouter(
      <MemoryRouter>
        <ViewPaymentsLists getAllPayments={() => {}} />
      </MemoryRouter>,
      { initialState, reducers },
    );

    expect(await screen.findByText(/Payments you received/)).to.exist;
    expect(
      await screen.findByText(/We don’t have a record of returned payments/),
    ).to.exist;
  });

  it('should render a payments returned table and handle an empty payments received table', async () => {
    const initialState = {
      allPayments: {
        isLoading: false,
        payments: {
          returnPayments: emptyPaymentsReceived.returnPayments,
          payments: [],
        },
        error: false,
      },
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const reducers = {
      allPayments: (state = initialState.allPayments) => state,
    };
    const screen = renderWithStoreAndRouter(
      <MemoryRouter>
        <ViewPaymentsLists getAllPayments={() => {}} />
      </MemoryRouter>,
      { initialState, reducers },
    );

    expect(
      await screen.findByText(
        /We don’t have a record of VA payments made to you/,
      ),
    ).to.exist;
    expect(await screen.findByText(/Payments returned/)).to.exist;
  });

  it('shows an info error when no payments are present', async () => {
    const initialState = {
      allPayments: {
        isLoading: false,
        payments: { returnPayments: [], payments: [] },
        error: false,
      },
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const reducers = {
      allPayments: (state = initialState.allPayments) => state,
    };
    const screen = renderWithStoreAndRouter(
      <MemoryRouter>
        <ViewPaymentsLists getAllPayments={() => {}} />
      </MemoryRouter>,
      { initialState, reducers },
    );

    expect(
      await screen.findByText(/We don’t have a record of VA payments for you/),
    ).to.exist;
  });

  it('should display the IdentityNotVerified alert', async () => {
    const initialState = {
      allPayments: {
        isLoading: false,
        payments: {
          returnPayments: payments.returnPayments || [],
          payments: receivedPayments,
        },
        error: false,
      },
      user: { profile: { loa: { current: 1 } } },
    };

    const reducers = {
      allPayments: (state = initialState.allPayments) => state,
    };
    const { container } = renderWithStoreAndRouter(
      <MemoryRouter>
        <ViewPaymentsLists getAllPayments={() => {}} />
      </MemoryRouter>,
      { initialState, reducers },
    );

    await waitFor(() => {
      expect(container.querySelector('va-alert-sign-in')).to.exist;
    });
  });
});
