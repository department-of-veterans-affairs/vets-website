import React from 'react';
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import StatementTable from '../../components/StatementTable';
import { showVHAPaymentHistory } from '../../../combined/utils/helpers';
import StatementCharges from '../../components/StatementCharges';
import mockstatements from '../../../combined/utils/mocks/mockStatements.json';

const createCharges = count => {
  return Array.from({ length: count }, (_, i) => ({
    pDTransDescOutput: `Charge ${i + 1}`,
    pDDatePostedOutput: '10/01/2023',
    pDRefNo: `REF${i + 1}`,
    pDTransAmt: 10.0,
  }));
};

const createVHACharges = count => {
  return Array.from({ length: count }, (_, i) => ({
    datePosted: '2023-10-01',
    description: `Charge ${i + 1}`,
    billingReference: `REF${i + 1}`,
    priceComponents: [{ amount: 10.0 }],
    providerName: 'Test Provider',
  }));
};

const mockFormatCurrency = val => `$${val.toFixed(2)}`;

// Helper to create a minimal Redux store
const createMockStore = (featureToggleValue = false) => {
  return createStore(() => ({
    featureToggles: {
      loading: false,
      [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: featureToggleValue,
    },
  }));
};

describe('Feature Toggle Data Confirmation', () => {
  afterEach(() => {
    cleanup();
  });

  it('showVHAPaymentHistory is true', () => {
    const mockState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
      },
    };

    const charges = createVHACharges(15);
    const store = createMockStore(true);
    const { container } = render(
      <Provider store={store}>
        <StatementTable
          charges={charges}
          formatCurrency={mockFormatCurrency}
          selectedCopay={{}}
        />
      </Provider>,
    );

    // Query the custom elements directly
    const rows = container.querySelectorAll('va-table-row');

    const firstRow = rows[1];

    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.true;

    expect(firstRow).to.exist;
    expect(
      within(firstRow).getByTestId('statement-description'),
    ).to.contain.text('Charge 1');
    expect(within(firstRow).getByTestId('statement-reference')).to.have.text(
      'REF1',
    );
    expect(
      within(firstRow).getByTestId('statement-transaction-amount'),
    ).to.have.text('$10.00');
    expect(within(firstRow).getByTestId('statement-date')).to.have.text(
      '10/01/2023',
    );

    expect(rows.length).to.equal(11);
  });

  it('navigates to page 2 and displays page 2 data', async () => {
    const charges = createCharges(15);
    const store = createMockStore(false);
    const { container } = render(
      <Provider store={store}>
        <StatementTable
          charges={charges}
          formatCurrency={mockFormatCurrency}
          selectedCopay={{}}
        />
      </Provider>,
    );

    const pagination = container.querySelector('va-pagination');

    fireEvent.click(pagination, { detail: { page: 2 } });

    waitFor(() => {
      const rows = container.querySelectorAll('va-table-row');

      expect(rows.length).to.equal(6); // 1 header row + 5 data rows
    });
  });

  describe('StatementTable focus', () => {
    const mockSelectedCopay = {
      pHNewBalance: 25,
      pHTotCredits: 15,
      pHPrevBal: 30,
      pSStatementDateOutput: '05/03/2024',
      pSStatementVal: 'STMT-123',
      statementStartDate: '2024-05-03',
      statementEndDate: '2024-06-03',
    };

    it('renders va-table with table-title-summary set to the statement date range', () => {
      const charges = createCharges(3);
      const store = createMockStore(false);
      const { container } = render(
        <Provider store={store}>
          <StatementTable
            charges={charges}
            formatCurrency={mockFormatCurrency}
            selectedCopay={{ ...mockSelectedCopay }}
          />
        </Provider>,
      );

      const table = container.querySelector('va-table');
      expect(table).to.exist;

      const tableTitleSummary = table.getAttribute('table-title-summary');
      expect(tableTitleSummary).to.exist;
      expect(tableTitleSummary).to.include(
        'This statement shows charges you received between May 3, 2024 and June 3, 2024',
      );
      expect(table.getAttribute('table-title')).to.equal(tableTitleSummary);
    });

    it('renders va-table with table-title-summary when statement dates are missing', () => {
      const charges = createCharges(2);
      const store = createMockStore(false);
      const { container } = render(
        <Provider store={store}>
          <StatementTable
            charges={charges}
            formatCurrency={mockFormatCurrency}
            selectedCopay={{
              ...mockSelectedCopay,
              statementStartDate: null,
              statementEndDate: null,
            }}
          />
        </Provider>,
      );

      const table = container.querySelector('va-table');
      expect(table).to.exist;
      expect(table.getAttribute('table-title-summary')).to.equal(
        'This statement shows your current charges.',
      );
    });

    it('after pagination click, the va-table component is the focus target', async () => {
      const charges = createCharges(15);
      const store = createMockStore(false);
      const { container } = render(
        <Provider store={store}>
          <StatementTable
            charges={charges}
            formatCurrency={mockFormatCurrency}
            selectedCopay={{ ...mockSelectedCopay }}
          />
        </Provider>,
      );

      const table = container.querySelector('va-table');
      expect(table.getAttribute('table-title-summary')).to.equal(
        'Showing 1-10 of 15 charges',
      );

      const pagination = container.querySelector('va-pagination');
      pagination.dispatchEvent(
        new CustomEvent('pageSelect', {
          detail: { page: 2 },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        expect(table.getAttribute('table-title-summary')).to.equal(
          'Showing 11-15 of 15 charges',
        );
      });

      // Focus logic targets va-table and sets tabindex="-1" on it; in jsdom
      // custom elements may not receive document.activeElement, so we assert
      // the correct component was targeted for focus.
      expect(table).to.exist;
      expect(table.getAttribute('tabindex')).to.equal('-1');
    });
  });

  // TODO: to be removed once toggle is fully enabled
  it('showVHAPaymentHistory is false', () => {
    const mockState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
      },
    };

    const { container } = render(
      <StatementCharges copay={mockstatements[2]} />,
    );

    // Query the custom elements directly
    const firstRow = container.querySelectorAll('va-table-row')[1];

    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.false;

    expect(firstRow).to.exist;
    expect(
      within(firstRow).getByTestId('statement-charges-description'),
    ).to.have.text('PAYMENT POSTED ON 04/29/2020');
    expect(
      within(firstRow).getByTestId('statement-charges-reference'),
    ).to.have.text('618-K00K9ZK');
    expect(
      within(firstRow).getByTestId('statement-charges-transaction-amount'),
    ).to.have.text('$24.00');
  });
});
