import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import OverviewPage from '../../containers/SummaryPage';
import DetailCopayPage from '../../containers/DetailCopayPage';

/**
 * Helper to render components with a mock Redux store
 */
const renderWithStore = (component, initialState) => {
  const store = createStore(
    combineReducers({
      combinedPortal: (state = initialState.combinedPortal) => state,
      user: (state = initialState.user) => state,
      featureToggles: (state = { loading: false }) => state,
    }),
  );
  return render(<Provider store={store}>{component}</Provider>);
};

describe('CDP – Copay Pages (unit)', () => {
  const selectedCopay = {
    id: 'f4385298-08a6-42f8-a86f-50e97033fb85',
    pHAmtDue: 15.0,
    pHNewBalance: 15.0,
    pHTotCharges: 10,
    pHTotCredits: 5,
    pSStatementDateOutput: '11/05/2023',
    pSFacilityNum: '534',
    station: {
      facilityName:
        'Ralph H. Johnson Department of Veterans Affairs Medical Center',
      city: 'Charleston',
    },
    details: [],
  };

  const initialState = {
    combinedPortal: {
      mcp: {
        statements: [selectedCopay],
        error: null,
      },
      debtLetters: {
        debts: [],
        errors: [],
      },
    },
    user: {
      profile: {
        userFullName: { first: 'Jane', last: 'Doe' },
      },
    },
  };

  // =======================
  // OverviewPage tests
  // =======================
  describe('OverviewPage', () => {
    it('displays copay balances - C12576', () => {
      const screen = renderWithStore(<OverviewPage />, initialState);

      expect(screen.getByTestId('summary-page-title')).to.exist;
      expect(screen.getByTestId(`balance-card-${selectedCopay.id}`)).to.exist;

      const amountElement = screen.getByTestId(`amount-${selectedCopay.id}`);
      expect(amountElement.textContent).to.contain('$15.00');
      expect(amountElement.textContent).to.not.contain('NaN');

      expect(
        screen.getByTestId(`facility-city-${selectedCopay.id}`),
      ).to.contain.text('Ralph H. Johnson');
    });

    it('renders link to copay detail page - C12577', () => {
      const screen = renderWithStore(<OverviewPage />, initialState);
      const link = screen.getByTestId(`detail-link-${selectedCopay.id}`);

      expect(link).to.exist;
      expect(link.getAttribute('href')).to.contain(selectedCopay.id);
    });

    it('displays NeedHelp section', () => {
      const screen = renderWithStore(<OverviewPage />, initialState);
      expect(screen.getByTestId('need-help')).to.exist;
    });
  });

  // =======================
  // DetailCopayPage tests
  // =======================
  describe('DetailCopayPage', () => {
    const match = { params: { id: selectedCopay.id } };

    it('displays copay details', () => {
      const screen = renderWithStore(
        <DetailCopayPage match={match} />,
        initialState,
      );

      // Verify the title
      expect(
        screen.getByTestId('detail-copay-page-title-otpp'),
      ).to.contain.text('Ralph H. Johnson');

      // Use getAllByText because $15.00 appears in the alert AND the details list
      const balanceElements = screen.getAllByText('$15.00');
      expect(balanceElements.length).to.be.at.least(1);

      // Verify key structural elements are present
      expect(screen.getByTestId('copay-past-due-alert')).to.exist;
      expect(screen.getByTestId('statement-charges-head')).to.exist;
      expect(screen.getByTestId('download-statement-section')).to.exist;

      // Verify payment due date logic (calculated as +30 days from statement date)
      expect(screen.getByText(/December 5, 2023/)).to.exist;
    });
  });
});
