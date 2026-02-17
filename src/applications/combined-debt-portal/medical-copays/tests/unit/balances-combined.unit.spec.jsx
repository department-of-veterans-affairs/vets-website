import { expect } from 'chai';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import React from 'react';
import { render } from '@testing-library/react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Balances from '../../../combined/components/Balances';
import { showVHAPaymentHistory } from '../../../combined/utils/helpers';

/**
 * Helper to render components with a mock Redux store
 */
const renderWithStore = (component, initialState) => {
  const store = createStore(
    combineReducers({
      combinedPortal: (state = initialState.combinedPortal || {}) => state,
      user: (state = initialState.user || {}) => state,
      featureToggles: (
        state = initialState.featureToggles || { loading: false },
      ) => state,
    }),
  );
  return render(
    <Provider store={store}>
      <Router>{component}</Router>
    </Provider>,
  );
};

describe('Balances', () => {
  it('shouldShowVHAPaymentHistory is true - renders with new data structure', () => {
    const mockState = {
      user: {},
      combinedPortal: {
        debtLetters: {
          isProfileUpdating: false,
          isPending: false,
          isPendingVBMS: false,
          isError: false,
          isVBMSError: false,
          debts: [],
          selectedDebt: {},
          debtLinks: [],
          errors: [],
          hasDependentDebts: false,
        },
        mcp: {
          pending: false,
          error: null,
          statements: {
            data: [
              {
                id: '4-1abZUKu7xIvIw6',
                type: 'medicalCopays',
                attributes: {
                  url: null,
                  facility: 'TEST VAMC',
                  facilityId: '4-O3d8XK44ejMS',
                  city: 'LYONS',
                  externalId: '4-1abZUKu7xIvIw6',
                  latestBillingRef: '4-6c9ZE23XQm5VawK',
                  currentBalance: 150.25,
                  previousBalance: 65.71,
                  previousUnpaidBalance: 0,
                  lastUpdatedAt: '2025-08-29T12:00:00Z',
                },
              },
            ],
            meta: {
              total: 10,
              page: 1,
              perPage: 3,
              copaySummary: {
                totalCurrentBalance: 150.25,
                copayBillCount: 1,
                lastUpdatedOn: '2025-08-29T12:00:00Z',
              },
            },
            links: {
              self: 'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=1',
              first:
                'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=1',
              next: 'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=2',
              last: 'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=4',
            },
          },
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        loading: false,
      },
    };

    const { container } = renderWithStore(<Balances />, mockState);

    expect(container).to.exist;

    // Verify BalanceCard is rendered
    const balanceCard = container.querySelector('[data-testid="card-amount"]');
    expect(balanceCard).to.exist;
    expect(balanceCard.textContent).to.include('$150.25');
    expect(balanceCard.textContent).to.include('for 1 copay bill');

    // Verify date is displayed
    const cardDate = container.querySelector('.card-date');
    expect(cardDate).to.exist;
    expect(cardDate.textContent).to.include('August 29, 2025');

    // Verify link is present
    const cardLink = container.querySelector('[data-testid="card-link"]');
    expect(cardLink).to.exist;

    // Verify helper function returns true
    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.true;
  });

  // TODO: to be removed once toggle is fully enabled
  it('shouldShowVHAPaymentHistory is false - renders with legacy data structure', () => {
    const mockState = {
      user: {},
      combinedPortal: {
        debtLetters: {
          isProfileUpdating: false,
          isPending: false,
          isPendingVBMS: false,
          isError: false,
          isVBMSError: false,
          debts: [],
          selectedDebt: {},
          debtLinks: [],
          errors: [],
          hasDependentDebts: false,
        },
        mcp: {
          pending: false,
          error: null,
          statements: [
            {
              id: '1',
              pSStatementDateOutput: '2025-01-05',
              pHAmtDue: 150.25,
              station: {
                facilityName: 'Test VAMC',
                city: 'Test City',
              },
            },
          ],
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        loading: false,
      },
    };

    const { container } = renderWithStore(<Balances />, mockState);

    expect(container).to.exist;

    // Verify BalanceCard is rendered
    const balanceCard = container.querySelector('[data-testid="card-amount"]');
    expect(balanceCard).to.exist;
    expect(balanceCard.textContent).to.include('$150.25');
    expect(balanceCard.textContent).to.include('for 1 copay bill');

    // Verify date is displayed
    const cardDate = container.querySelector('.card-date');
    expect(cardDate).to.exist;
    expect(cardDate.textContent).to.include('January 5, 2025');

    // Verify link is present
    const cardLink = container.querySelector('[data-testid="card-link"]');
    expect(cardLink).to.exist;

    // Verify helper function returns false
    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.false;
  });
});
