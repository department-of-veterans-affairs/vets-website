import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { resetFetch } from 'platform/testing/unit/helpers';
import { expect } from 'chai';
import allPayments from '../../../reducers/index';
import environment from 'platform/utilities/environment';
import ViewPaymentsLists from '../../../components/view-payments-lists/ViewPaymentsLists.jsx';
import {
  payments,
  emptyPaymentsReturned,
  emptyPaymentsReceived,
  emptyPaymentsResponse,
} from '../../helpers';

describe('View Payments Lists', () => {
  let server;
  const overrideServerWithOptions = payload => {
    server.use(
      rest.get(
        `${environment.API_URL}/v0/profile/payment_history`,
        (req, res, ctx) => {
          return res.once(
            ctx.json({
              data: {
                attributes: payload,
                metadata: [],
              },
            }),
          );
        },
      ),
    );
  };

  before(() => {
    resetFetch();
    server = setupServer(
      rest.get(
        `${environment.API_URL}/v0/profile/payment_history`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              data: {
                attributes: payments,
                metadata: [],
              },
            }),
          );
        },
      ),
    );
    server.listen();
  });
  afterEach(() => server.resetHandlers());
  after(() => server.close());

  it('renders View Payments Lists component with both tables', async () => {
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
    };

    const screen = renderInReduxProvider(<ViewPaymentsLists />, {
      initialState,
      reducers: allPayments,
    });
    expect(await screen.findByText(/Payments you received/)).to.exist;
    expect(screen.getByText(/Payments returned/)).to.exist;
  });

  it('should render a payments received table and handle an empty payments returned table', async () => {
    overrideServerWithOptions(emptyPaymentsReturned);
    const initialState = {
      isLoading: false,
      payments: null,
      error: false,
    };

    const screen = renderInReduxProvider(<ViewPaymentsLists />, {
      initialState,
      reducers: allPayments,
    });

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
    };

    const screen = renderInReduxProvider(<ViewPaymentsLists />, {
      initialState,
      reducers: allPayments,
    });

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
    };

    const screen = renderInReduxProvider(<ViewPaymentsLists />, {
      initialState,
      reducers: allPayments,
    });

    expect(
      await screen.findByText(/We don’t have a record of VA payments for you/),
    ).to.exist;
  });
});
