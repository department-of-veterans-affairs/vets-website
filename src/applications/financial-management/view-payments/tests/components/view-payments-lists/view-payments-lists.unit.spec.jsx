import React from 'react';
import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import environment from 'platform/utilities/environment';

import { MemoryRouter } from 'react-router-dom-v5-compat';
import allPayments from '../../../reducers/index';
import ViewPaymentsLists from '../../../components/view-payments-lists/ViewPaymentsLists';
import {
  payments,
  emptyPaymentsReturned,
  emptyPaymentsReceived,
  emptyPaymentsResponse,
} from '../../helpers';

describe('View Payments Lists', () => {
  const overrideServerWithOptions = payload => {
    server.use(
      createGetHandler(
        `${environment.API_URL}/v0/profile/payment_history`,
        () =>
          jsonResponse({
            data: {
              attributes: payload,
              metadata: [],
            },
          }),
      ),
    );
  };

  beforeEach(() => {
    server.use(
      createGetHandler(
        `${environment.API_URL}/v0/profile/payment_history`,
        () =>
          jsonResponse({
            data: {
              attributes: payments,
              metadata: [],
            },
          }),
      ),
    );
  });

  it('renders View Payments Lists component with both tables', async () => {
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const screen = renderInReduxProvider(
      <MemoryRouter>
        <ViewPaymentsLists />
      </MemoryRouter>,
      {
        initialState,
        reducers: allPayments,
      },
    );
    expect(await screen.findByText(/Payments you received/)).to.exist;
    expect(screen.getByText(/Payments returned/)).to.exist;
  });

  it('should render a payments received table and handle an empty payments returned table', async () => {
    overrideServerWithOptions(emptyPaymentsReturned);
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const screen = renderInReduxProvider(
      <MemoryRouter>
        <ViewPaymentsLists />
      </MemoryRouter>,
      {
        initialState,
        reducers: allPayments,
      },
    );

    expect(await screen.findByText(/Payments you received/)).to.exist;
    expect(
      await screen.findByText(/We don’t have a record of returned payments/),
    ).to.exist;
  });

  it('should render a payments returned table and handle an empty payments received table', async () => {
    overrideServerWithOptions(emptyPaymentsReceived);
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const screen = renderInReduxProvider(
      <MemoryRouter>
        <ViewPaymentsLists />
      </MemoryRouter>,
      {
        initialState,
        reducers: allPayments,
      },
    );

    expect(
      await screen.findByText(
        /We don’t have a record of VA payments made to you/,
      ),
    ).to.exist;
    expect(await screen.findByText(/Payments returned/)).to.exist;
  });

  it('shows an info error when no payments are present', async () => {
    overrideServerWithOptions(emptyPaymentsResponse);
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    };

    const screen = renderInReduxProvider(<ViewPaymentsLists />, {
      initialState,
      reducers: allPayments,
    });

    expect(
      await screen.findByText(/We don’t have a record of VA payments for you/),
    ).to.exist;
  });

  it('should display the IdentityNotVerified alert', async () => {
    overrideServerWithOptions(payments);
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
      user: { profile: { loa: { current: 1 } } },
    };

    const { container } = renderInReduxProvider(
      <MemoryRouter>
        <ViewPaymentsLists />
      </MemoryRouter>,
      {
        initialState,
        reducers: allPayments,
      },
    );

    await waitFor(() => {
      expect(container.querySelector('va-alert-sign-in')).to.exist;
    });
  });
});
