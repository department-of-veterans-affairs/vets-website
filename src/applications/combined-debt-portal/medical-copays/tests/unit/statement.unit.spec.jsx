import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import AccountSummary from '../../components/AccountSummary';
import StatementAddresses from '../../components/StatementAddresses';
import StatementCharges from '../../components/StatementCharges';
import StatementTable from '../../components/StatementTable';
import DownloadStatement from '../../components/DownloadStatement';
import MonthlyStatementPage from '../../containers/MonthlyStatementPage';

// Helper to create a minimal Redux store for components that use useSelector
const createMockStore = (featureToggleValue = false) => {
  return createStore(() => ({
    featureToggles: {
      loading: false,
      useLighthouseCopays: featureToggleValue,
    },
  }));
};

const registerMockElement = name => {
  class MockWebComponent extends HTMLElement {}
  if (typeof window !== 'undefined' && !window.customElements.get(name)) {
    window.customElements.define(name, MockWebComponent);
  }
};

const defaultUser = {
  profile: { userFullName: { first: 'Jane', last: 'Doe' } },
};

const createPageState = ({
  copays = [],
  isCopaysLoading = false,
  useLighthouseCopays = false,
} = {}) => ({
  user: defaultUser,
  combinedPortal: {
    mcp: { copays, isCopaysLoading },
  },
  featureToggles: {
    [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: useLighthouseCopays,
    loading: false,
  },
});

const expectLoadingIndicator = container => {
  const el = container.querySelector('va-loading-indicator');
  expect(el).to.exist;
  expect(el.getAttribute('message')).to.equal('Loading features...');
};

describe('Monthly statement page', () => {
  describe('MonthlyStatementPage container', () => {
    before(() => {
      registerMockElement('va-breadcrumbs');
      registerMockElement('va-loading-indicator');
      registerMockElement('va-link');
      registerMockElement('va-table');
      registerMockElement('va-table-row');
    });

    const renderPage = (
      initialState,
      route = '/copay-balances/stmt-123/statement',
    ) => {
      const store = createStore(
        combineReducers({
          combinedPortal: (state = initialState.combinedPortal ?? {}) => state,
          user: (state = initialState.user ?? {}) => state,
          featureToggles: (
            state = initialState.featureToggles ?? { loading: false },
          ) => state,
        }),
      );

      return render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <Route
              path="/copay-balances/:id/statement"
              component={MonthlyStatementPage}
            />
          </MemoryRouter>
        </Provider>,
      );
    };

    it('shows loading indicator when copays are loading', () => {
      const { container } = renderPage(
        createPageState({ isCopaysLoading: true }),
      );
      expectLoadingIndicator(container);
    });

    it('shows loading indicator when there are no statement copays', () => {
      const { container } = renderPage(createPageState());
      expectLoadingIndicator(container);
    });

    it('renders monthly statement page with legacy copay data', () => {
      const legacyCopay = {
        id: 'stmt-123',
        /* eslint-disable-next-line camelcase */
        statement_id: 'stmt-123',
        station: { facilityName: 'Test VA Medical Center' },
        pSStatementDateOutput: '05/03/2024',
        accountNumber: 'ACC-456',
        pHTotCharges: 50,
        details: [{ pDTransAmt: 100, pDTransDescOutput: 'Charge description' }],
      };

      const { getByTestId, getByText } = renderPage(
        createPageState({ copays: [legacyCopay] }),
      );

      expect(getByTestId('statement-page-title')).to.exist;
      expect(getByTestId('statement-page-title').textContent).to.include(
        'July 1, 2024 statement',
      );
      expect(getByTestId('facility-name').textContent).to.include(
        'Test VA Medical Center',
      );
      expect(getByTestId('account-summary-head')).to.exist;
      expect(getByTestId('statement-address-head')).to.exist;
      expect(getByText('Account summary')).to.exist;
    });

    it('renders monthly statement page with lighthouse copay data', () => {
      const lighthouseCopay = {
        id: 'stmt-456',
        /* eslint-disable-next-line camelcase */
        statement_id: 'stmt-456',
        attributes: {
          facility: { name: 'Lighthouse VA Medical Center' },
          invoiceDate: '2024-06-15',
          accountNumber: 'ACC-789',
          principalPaid: 25,
          lineItems: [
            { pDTransAmt: 75, pDTransDescOutput: 'Lighthouse charge' },
          ],
        },
      };

      const { getByTestId, getByText, container } = renderPage(
        createPageState({
          copays: [lighthouseCopay],
          useLighthouseCopays: true,
        }),
        '/copay-balances/stmt-456/statement',
      );

      expect(getByTestId('statement-page-title')).to.exist;
      expect(getByTestId('statement-page-title').textContent).to.include(
        'July 1, 2024 statement',
      );
      expect(getByTestId('facility-name').textContent).to.include(
        'Lighthouse VA Medical Center',
      );
      expect(getByTestId('account-summary-head')).to.exist;
      expect(getByTestId('statement-address-head')).to.exist;
      expect(getByText('Account summary')).to.exist;
      expect(container.querySelector('va-table')).to.exist;
    });

    const STATEMENT_ID = 'stmt-123';
    const route = `/copay-balances/statements/${STATEMENT_ID}`;

    /* eslint-disable camelcase */
    const legacyCopaySingle = {
      id: 'legacy-1',
      statement_id: STATEMENT_ID,
      station: { facilityName: 'Legacy VA Medical Center' },
      pSStatementDateOutput: '05/03/2024',
      accountNumber: 'ACC-LEGACY',
      pHTotCharges: 50,
      details: [{ pDTransAmt: 100, pDTransDescOutput: 'Charge description' }],
    };

    const legacyCopayTwo = {
      id: 'legacy-2',
      statement_id: STATEMENT_ID,
      station: { facilityName: 'Legacy VA Medical Center' },
      pSStatementDateOutput: '05/03/2024',
      accountNumber: 'ACC-LEGACY',
      pHTotCharges: 25,
      details: [{ pDTransAmt: 30, pDTransDescOutput: 'Another charge' }],
    };

    const lighthouseCopaySingle = {
      id: 'lighthouse-1',
      statement_id: STATEMENT_ID,
      attributes: {
        facility: { name: 'Lighthouse VA Medical Center' },
        invoiceDate: '2024-06-15',
        accountNumber: 'ACC-LIGHTHOUSE',
        principalPaid: 25,
        lineItems: [{ pDTransAmt: 75, pDTransDescOutput: 'Lighthouse charge' }],
      },
    };

    const lighthouseCopayTwo = {
      id: 'lighthouse-2',
      statement_id: STATEMENT_ID,
      attributes: {
        facility: { name: 'Lighthouse VA Medical Center' },
        invoiceDate: '2024-06-15',
        accountNumber: 'ACC-LIGHTHOUSE',
        principalPaid: 10,
        lineItems: [{ pDTransAmt: 40, pDTransDescOutput: 'Second charge' }],
      },
    };
    /* eslint-enable camelcase */

    describe('when flag is off (legacy)', () => {
      it('getLegacyAttributes produces the correct object for a single copay', () => {
        const initialState = createPageState({
          copays: [legacyCopaySingle],
          useLighthouseCopays: false,
        });
        const { getByTestId, getByText } = renderPage(initialState, route);

        expect(getByTestId('statement-page-title').textContent).to.equal(
          'July 1, 2024 statement',
        );
        expect(getByTestId('facility-name').textContent).to.include(
          'Legacy VA Medical Center',
        );
        expect(getByText('ACC-LEGACY')).to.exist;
        expect(getByTestId('account-summary-previous').textContent).to.include(
          '$100.00',
        );
        expect(getByTestId('account-summary-credits').textContent).to.include(
          '$50.00',
        );
      });

      it('getLegacyAttributes produces the correct object for multiple copays (flattened charges, summed payments, latest for metadata)', () => {
        const initialState = createPageState({
          copays: [legacyCopaySingle, legacyCopayTwo],
          useLighthouseCopays: false,
        });
        const { getByTestId, getByText } = renderPage(initialState, route);

        expect(getByTestId('statement-page-title').textContent).to.equal(
          'July 1, 2024 statement',
        );
        expect(getByTestId('facility-name').textContent).to.include(
          'Legacy VA Medical Center',
        );
        expect(getByText('ACC-LEGACY')).to.exist;
        expect(getByTestId('account-summary-previous').textContent).to.include(
          '$130.00',
        );
        expect(getByTestId('account-summary-credits').textContent).to.include(
          '$75.00',
        );
      });
    });

    describe('when flag is on (lighthouse)', () => {
      it('getLighthouseAttributes produces the correct object for a single copay', () => {
        const initialState = createPageState({
          copays: [lighthouseCopaySingle],
          useLighthouseCopays: true,
        });
        const { getByTestId, getByText } = renderPage(initialState, route);

        expect(getByTestId('statement-page-title').textContent).to.include(
          'July 1, 2024 statement',
        );
        expect(getByTestId('facility-name').textContent).to.include(
          'Lighthouse VA Medical Center',
        );
        expect(getByText('ACC-LIGHTHOUSE')).to.exist;
        expect(getByTestId('account-summary-previous').textContent).to.include(
          '$75.00',
        );
        expect(getByTestId('account-summary-credits').textContent).to.include(
          '$25.00',
        );
      });

      it('getLighthouseAttributes produces the correct object for multiple copays (flattened lineItems, summed balance and payments, latest for metadata)', () => {
        const initialState = createPageState({
          copays: [lighthouseCopaySingle, lighthouseCopayTwo],
          useLighthouseCopays: true,
        });
        const { getByTestId, getByText } = renderPage(initialState, route);

        expect(getByTestId('statement-page-title').textContent).to.include(
          'July 1, 2024 statement',
        );
        expect(getByTestId('facility-name').textContent).to.include(
          'Lighthouse VA Medical Center',
        );
        expect(getByText('ACC-LIGHTHOUSE')).to.exist;
        expect(getByTestId('account-summary-previous').textContent).to.include(
          '$115.00',
        );
        expect(getByTestId('account-summary-credits').textContent).to.include(
          '$35.00',
        );
      });
    });
  });

  describe('statement account summary component', () => {
    it('should render account values', () => {
      const summary = render(
        <AccountSummary
          acctNum="ACC-123"
          paymentsReceived={15}
          newCharges={30}
        />,
      );
      expect(summary.getByTestId('account-summary-head')).to.exist;
      expect(summary.getByTestId('account-summary-previous')).to.exist;
      expect(
        summary.getByTestId('account-summary-previous').textContent,
      ).to.include('This statement charges: $30.00');
      expect(summary.getByTestId('account-summary-credits')).to.exist;
      expect(
        summary.getByTestId('account-summary-credits').textContent,
      ).to.include('Payments received: $15.00');
      expect(summary.getByText('ACC-123')).to.exist;
    });
  });

  describe('statement addresses component', () => {
    it('should render statement addresses', () => {
      const selectedCopay = {
        id: '123',
        station: {
          facilityName: 'Test Facility',
          staTAddress1: '123 Main St',
          staTAddress2: 'Apt 1',
          staTAddress3: 'Address 3',
          city: 'New York',
          state: 'NY',
          ziPCde: '10001',
          recipientAddress1: '456 Alternate St',
          recipientAddress2: 'Apt 2',
          recipientAddress3: 'Test Patient Address 3',
        },
        pHAddress1: '456 Alternate St',
        pHAddress2: 'Apt 2',
        pHAddress3: 'Test Patient Address 3',
        pHCity: 'Tampa',
        pHState: 'FL',
        pHZipCde: '33333',
      };

      // Create store with full state including selectedStatement
      const store = createStore(() => ({
        featureToggles: {
          loading: false,
          useLighthouseCopays: false,
        },
        combinedPortal: {
          mcp: {
            selectedStatement: selectedCopay,
          },
        },
      }));

      const addresses = render(
        <Provider store={store}>
          <StatementAddresses copay={selectedCopay} />
        </Provider>,
      );
      expect(addresses.getByTestId('statement-address-head')).to.exist;
      expect(addresses.getByTestId('sender-address-head')).to.exist;

      expect(addresses.getByTestId('sender-facility-name')).to.exist;
      expect(addresses.getByTestId('sender-facility-name')).to.have.text(
        'Test Facility',
      );

      expect(addresses.getByTestId('sender-address-one')).to.exist;
      expect(addresses.getByTestId('sender-address-one')).to.have.text(
        '123 Main St',
      );

      expect(addresses.getByTestId('sender-address-two')).to.exist;
      expect(addresses.getByTestId('sender-address-two')).to.have.text('Apt 1');

      expect(addresses.getByTestId('sender-address-three')).to.exist;
      expect(addresses.getByTestId('sender-address-three')).to.have.text(
        'Address 3',
      );

      expect(addresses.getByTestId('sender-city-state-zip')).to.exist;
      expect(addresses.getByTestId('sender-city-state-zip')).to.have.text(
        'New York, NY 10001',
      );

      expect(addresses.getByTestId('recipient-address-head')).to.exist;
      expect(addresses.getByTestId('recipient-address-one')).to.exist;
      expect(addresses.getByTestId('recipient-address-one')).to.have.text(
        '456 Alternate St',
      );

      expect(addresses.getByTestId('recipient-address-two')).to.exist;
      expect(addresses.getByTestId('recipient-address-two')).to.have.text(
        'Apt 2',
      );

      expect(addresses.getByTestId('recipient-address-three')).to.exist;
      expect(addresses.getByTestId('recipient-address-three')).to.have.text(
        'Test Patient Address 3',
      );

      expect(addresses.getByTestId('recipient-city-state-zip')).to.exist;
      expect(addresses.getByTestId('recipient-city-state-zip')).to.have.text(
        'Tampa, FL 33333',
      );
    });
  });

  describe('statement charges component', () => {
    it('should render statement charges', () => {
      const selectedCopay = {
        details: [
          {
            pDTransDescOutput: 'Test Output',
            pDRefNo: '123-BILLREF',
            pDTransAmtOutput: '350.00',
          },
        ],
      };

      const charges = render(<StatementCharges copay={selectedCopay} />);
      expect(charges.getByTestId('statement-charges-head')).to.exist;
      expect(charges.getByTestId('statement-charges-table')).to.exist;
    });
  });

  describe('StatementTable component', () => {
    const mockSelectedCopay = {
      pHNewBalance: 25,
      pHTotCredits: 15,
      pHPrevBal: 30,
      pSStatementDateOutput: '05/03/2024',
      pSStatementVal: 'STMT-123',
      statementStartDate: '2024-05-03',
      statementEndDate: '2024-06-03',
      details: [
        {
          pDTransDescOutput: 'Test Charge',
          pDRefNo: '123-BILLREF',
          pDTransAmt: 100,
          pDDatePostedOutput: '05/15/2024',
        },
      ],
    };

    const mockFormatCurrency = amount => {
      if (!amount) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    it('should render statement table with date range when dates are provided', () => {
      const store = createMockStore(false);
      const { container } = render(
        <Provider store={store}>
          <StatementTable
            charges={mockSelectedCopay.details}
            formatCurrency={mockFormatCurrency}
            selectedCopay={mockSelectedCopay}
          />
        </Provider>,
      );

      const table = container.querySelector('va-table');
      expect(table).to.exist;
      expect(table.getAttribute('table-title')).to.include(
        'This statement shows charges you received between May 3, 2024 and June 3, 2024',
      );
    });

    it('should render fallback text when statement dates are missing', () => {
      const copayWithoutDates = {
        ...mockSelectedCopay,
        statementStartDate: null,
        statementEndDate: null,
      };

      const store = createMockStore(false);
      const { container } = render(
        <Provider store={store}>
          <StatementTable
            charges={mockSelectedCopay.details}
            formatCurrency={mockFormatCurrency}
            selectedCopay={copayWithoutDates}
          />
        </Provider>,
      );

      const table = container.querySelector('va-table');
      expect(table).to.exist;
      expect(table.getAttribute('table-title')).to.equal(
        'This statement shows your current charges.',
      );
    });

    it('should NOT render Total Credits row', () => {
      const store = createMockStore(false);
      const { container } = render(
        <Provider store={store}>
          <StatementTable
            charges={mockSelectedCopay.details}
            formatCurrency={mockFormatCurrency}
            selectedCopay={mockSelectedCopay}
          />
        </Provider>,
      );

      const tableRows = container.querySelectorAll('va-table-row');
      const totalCreditsRow = Array.from(tableRows).find(row =>
        row.textContent.includes('Total Credits'),
      );
      expect(totalCreditsRow).to.not.exist;
    });
  });

  describe('DownloadStatement component', () => {
    const mockProps = {
      statementId: '123',
      statementDate: '05032024',
      fullName: 'John Doe',
    };

    it('should render PDF link with proper spacing', () => {
      const { container } = render(<DownloadStatement {...mockProps} />);

      // Check that va-link has the correct filetype attribute
      const vaLink = container.querySelector('va-link');
      expect(vaLink).to.exist;
      expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    });

    it('should render download link with correct attributes', () => {
      const { container } = render(<DownloadStatement {...mockProps} />);

      const vaLink = container.querySelector('va-link');
      expect(vaLink).to.exist;
      expect(vaLink.hasAttribute('download')).to.be.true;
      expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    });
  });
});
