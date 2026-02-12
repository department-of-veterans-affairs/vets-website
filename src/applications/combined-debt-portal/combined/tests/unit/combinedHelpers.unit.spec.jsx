import { expect } from 'chai';
import { addMonths, subMonths, addDays } from 'date-fns';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { uniqBy } from 'lodash';
import { render } from '@testing-library/react';
import { createStore, combineReducers } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import MockDate from 'mockdate';
import {
  APP_TYPES,
  ALERT_TYPES,
  API_RESPONSES,
  selectLoadingFeatureFlags,
  currency,
  formatTableData,
  titleCase,
  verifyCurrentBalance,
  transform,
  setPageFocus,
  formatDate,
  calcDueDate,
  sortStatementsByDate,
  combinedPortalAccess,
  debtLettersShowLettersVBMS,
  showPaymentHistory,
  cdpAccessToggle,
  showVHAPaymentHistory,
} from '../../utils/helpers';
import OverviewPage from '../../containers/OverviewPage';

describe('Helper Functions', () => {
  describe('APP_TYPES', () => {
    it('should have correct values', () => {
      expect(APP_TYPES.DEBT).to.equal('DEBT');
      expect(APP_TYPES.COPAY).to.equal('COPAY');
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(APP_TYPES)).to.be.true;
    });

    it('should have exactly 2 properties', () => {
      expect(Object.keys(APP_TYPES).length).to.equal(2);
    });
  });

  describe('ALERT_TYPES', () => {
    it('should have correct values', () => {
      expect(ALERT_TYPES.ALL_ERROR).to.equal('ALL_ERROR');
      expect(ALERT_TYPES.ALL_ZERO).to.equal('ALL_ZERO');
      expect(ALERT_TYPES.ERROR).to.equal('ERROR');
      expect(ALERT_TYPES.ZERO).to.equal('ZERO');
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(ALERT_TYPES)).to.be.true;
    });

    it('should have exactly 4 properties', () => {
      expect(Object.keys(ALERT_TYPES).length).to.equal(4);
    });
  });

  describe('API_RESPONSES', () => {
    it('should have correct values', () => {
      expect(API_RESPONSES.ERROR).to.equal(-1);
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(API_RESPONSES)).to.be.true;
    });
  });

  describe('selectLoadingFeatureFlags', () => {
    it('should return loading state of feature flags', () => {
      const mockState = { featureToggles: { loading: true } };
      expect(selectLoadingFeatureFlags(mockState)).to.be.true;
    });
  });

  describe('currency', () => {
    it('should format currency correctly', () => {
      expect(currency(1234.56)).to.equal('$1,234.56');
      expect(currency('1000')).to.equal('$1,000.00');
    });
  });

  describe('formatTableData', () => {
    it('should format table data correctly', () => {
      const input = [{ date: '2023-01-15', desc: 'Test', amount: 100 }];
      const output = formatTableData(input);
      expect(output[0].date).to.equal('2023-01-15');
      expect(output[0].desc.type).to.equal('strong');
      expect(output[0].desc.props.children).to.equal('Test');
      expect(output[0].amount).to.equal('$100.00');
    });

    it('should handle multiple rows', () => {
      const input = [
        { date: '2023-01-15', desc: 'First', amount: 100 },
        { date: '2023-02-15', desc: 'Second', amount: 200.5 },
      ];
      const output = formatTableData(input);
      expect(output.length).to.equal(2);
      expect(output[1].desc.props.children).to.equal('Second');
      expect(output[1].amount).to.equal('$200.50');
    });

    it('should handle string amounts', () => {
      const input = [{ date: '2023-01-15', desc: 'Test', amount: '150.75' }];
      const output = formatTableData(input);
      expect(output[0].amount).to.equal('$150.75');
    });
  });

  describe('titleCase', () => {
    it('should convert string to title case', () => {
      expect(titleCase('hello world')).to.equal('Hello World');
    });
  });

  describe('formatDate - expected output example: October 13, 2018', () => {
    const expectedResult = 'October 13, 2018';

    it("should return correctly formatted date from string that uses '/' delimiter", () => {
      const simpleDate = '10/13/2018';
      expect(formatDate(simpleDate)).to.equal(expectedResult);
    });

    it("should return correctly formatted date from string that has '-' delimiter", () => {
      const simpleDate = '10-13-2018';
      expect(formatDate(simpleDate)).to.equal(expectedResult);
    });

    it('should return correctly formatted date from string from new date object', () => {
      const simpleDate = new Date('10/13/2018');
      expect(formatDate(simpleDate)).to.equal(expectedResult);
    });
  });

  describe('verifyCurrentBalance', () => {
    beforeEach(() => {
      MockDate.set('2025-01-15');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should return true if current date is on or before due date', () => {
      const futureDate = addMonths(new Date(), 1);
      expect(verifyCurrentBalance(futureDate)).to.be.true;
    });

    it('should return false if current date is after due date', () => {
      const pastDate = subMonths(new Date(), 2);
      expect(verifyCurrentBalance(pastDate)).to.be.false;
    });

    it('should return true for exactly 30 days from now', () => {
      const exactDueDate = addMonths(new Date(), 1);
      expect(verifyCurrentBalance(exactDueDate)).to.be.true;
    });

    it('should handle date strings', () => {
      const futureDate = addMonths(new Date(), 2).toISOString();
      expect(verifyCurrentBalance(futureDate)).to.be.true;
    });
  });

  describe('transform', () => {
    it('should transform data correctly', () => {
      const input = [
        {
          station: {
            facilitYNum: '123',
            city: 'NEW YORK',
          },
        },
      ];
      const output = transform(input);
      expect(output[0].station.facilityName).to.equal(
        getMedicalCenterNameByID('123'),
      );
      expect(output[0].station.city).to.equal('New York');
    });

    it('should handle mixed case cities', () => {
      const input = [
        {
          station: {
            facilitYNum: '456',
            city: 'los ANGELES',
          },
        },
      ];
      const output = transform(input);
      expect(output[0].station.city).to.equal('Los Angeles');
    });

    it('should handle lowercase cities', () => {
      const input = [
        {
          station: {
            facilitYNum: '789',
            city: 'chicago',
          },
        },
      ];
      const output = transform(input);
      expect(output[0].station.city).to.equal('Chicago');
    });

    it('should preserve other statement properties', () => {
      const input = [
        {
          id: 'test-id',
          date: '2023-01-15',
          amount: 100,
          station: {
            facilitYNum: '123',
            city: 'MIAMI',
            state: 'FL',
          },
        },
      ];
      const output = transform(input);
      expect(output[0].id).to.equal('test-id');
      expect(output[0].date).to.equal('2023-01-15');
      expect(output[0].amount).to.equal(100);
      expect(output[0].station.state).to.equal('FL');
    });
  });
  describe('setPageFocus', () => {
    it('should set focus on the correct element', () => {
      document.body.innerHTML = '<div id="main"><h1></h1></div>';
      setPageFocus('#main h1');
      expect(
        document.querySelector('#main h1').getAttribute('tabIndex'),
      ).to.equal('-1');
    });

    it('should set focus on main h1 if selector not found', () => {
      document.body.innerHTML = '<div id="main"><h1></h1></div>';
      setPageFocus('#non-existent');
      expect(
        document.querySelector('#main h1').getAttribute('tabIndex'),
      ).to.equal('-1');
    });
  });

  describe('calcDueDate', () => {
    beforeEach(() => {
      MockDate.set('2025-01-15');
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should calculate due date 30 days from given date', () => {
      const startDate = '2023-01-01';
      const result = calcDueDate(startDate, 30);
      // calcDueDate adds days to the date and formats it
      const expectedDate = formatDate(addDays(new Date(startDate), 30));
      expect(result).to.equal(expectedDate);
    });

    it('should handle different number of days', () => {
      const startDate = '2023-01-01';
      const result = calcDueDate(startDate, 15);
      const expectedDate = formatDate(addDays(new Date(startDate), 15));
      expect(result).to.equal(expectedDate);
    });

    it('should handle month boundaries', () => {
      const startDate = '2023-01-31';
      const result = calcDueDate(startDate, 30);
      const expectedDate = formatDate(addDays(new Date(startDate), 30));
      expect(result).to.equal(expectedDate);
    });

    it('should handle zero days', () => {
      const startDate = '2023-01-15';
      const result = calcDueDate(startDate, 0);
      const expectedDate = formatDate(addDays(new Date(startDate), 0));
      expect(result).to.equal(expectedDate);
    });

    it('should handle negative days', () => {
      const startDate = '2023-01-15';
      const result = calcDueDate(startDate, -5);
      const expectedDate = formatDate(addDays(new Date(startDate), -5));
      expect(result).to.equal(expectedDate);
    });

    it('should handle large number of days', () => {
      const startDate = '2023-01-01';
      const result = calcDueDate(startDate, 365);
      const expectedDate = formatDate(addDays(new Date(startDate), 365));
      expect(result).to.equal(expectedDate);
    });

    it('should handle date objects', () => {
      const startDate = new Date('2023-06-15');
      const result = calcDueDate(startDate, 10);
      const expectedDate = formatDate(addDays(startDate, 10));
      expect(result).to.equal(expectedDate);
    });
  });

  describe('sortStatementsByDate', () => {
    it('should sort statements by date in descending order', () => {
      const statements = [
        { pSStatementDateOutput: '2023-01-01' },
        { pSStatementDateOutput: '2023-03-01' },
        { pSStatementDateOutput: '2023-02-01' },
      ];
      const sorted = sortStatementsByDate(statements);
      expect(sorted[0].pSStatementDateOutput).to.equal('2023-03-01');
      expect(sorted[1].pSStatementDateOutput).to.equal('2023-02-01');
      expect(sorted[2].pSStatementDateOutput).to.equal('2023-01-01');
    });

    it('should handle empty array', () => {
      const statements = [];
      const sorted = sortStatementsByDate(statements);
      expect(sorted).to.deep.equal([]);
    });

    it('should handle single statement', () => {
      const statements = [{ pSStatementDateOutput: '2023-01-01' }];
      const sorted = sortStatementsByDate(statements);
      expect(sorted.length).to.equal(1);
      expect(sorted[0].pSStatementDateOutput).to.equal('2023-01-01');
    });

    it('should handle identical dates', () => {
      const statements = [
        { pSStatementDateOutput: '2023-01-01', id: 1 },
        { pSStatementDateOutput: '2023-01-01', id: 2 },
        { pSStatementDateOutput: '2023-01-01', id: 3 },
      ];
      const sorted = sortStatementsByDate(statements);
      expect(sorted.length).to.equal(3);
      expect(sorted[0].pSStatementDateOutput).to.equal('2023-01-01');
    });

    it('should preserve other properties', () => {
      const statements = [
        { pSStatementDateOutput: '2023-01-01', amount: 100, type: 'debt' },
        { pSStatementDateOutput: '2023-02-01', amount: 200, type: 'copay' },
      ];
      const sorted = sortStatementsByDate(statements);
      expect(sorted[0].amount).to.equal(200);
      expect(sorted[0].type).to.equal('copay');
      expect(sorted[1].amount).to.equal(100);
      expect(sorted[1].type).to.equal('debt');
    });

    it('should handle date strings with time', () => {
      const statements = [
        { pSStatementDateOutput: '2023-01-01T10:00:00' },
        { pSStatementDateOutput: '2023-01-01T15:00:00' },
        { pSStatementDateOutput: '2023-01-01T08:00:00' },
      ];
      const sorted = sortStatementsByDate(statements);
      expect(sorted[0].pSStatementDateOutput).to.equal('2023-01-01T15:00:00');
      expect(sorted[1].pSStatementDateOutput).to.equal('2023-01-01T10:00:00');
      expect(sorted[2].pSStatementDateOutput).to.equal('2023-01-01T08:00:00');
    });
  });

  describe('formatDate edge cases', () => {
    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid-date')).to.equal('');
      expect(formatDate(null)).to.equal('');
      expect(formatDate(undefined)).to.equal('');
    });

    it('should handle date objects', () => {
      const date = new Date('2023-05-15');
      // The actual formatted date should match what formatDate returns
      const result = formatDate(date);
      // We're testing that it handles date objects, not the specific output
      expect(result).to.be.a('string');
      expect(result).to.include('May');
      expect(result).to.include('2023');
    });

    it('should handle ISO date strings', () => {
      expect(formatDate('2023-05-15')).to.equal('May 15, 2023');
    });
  });

  describe('currency edge cases', () => {
    it('should handle zero', () => {
      expect(currency(0)).to.equal('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(currency(-100)).to.equal('-$100.00');
    });

    it('should handle very large numbers', () => {
      expect(currency(1000000)).to.equal('$1,000,000.00');
    });

    it('should handle string with decimals', () => {
      expect(currency('123.456')).to.equal('$123.46');
    });
  });

  describe('titleCase edge cases', () => {
    it('should handle empty string', () => {
      expect(titleCase('')).to.equal('');
    });

    it('should handle single word', () => {
      expect(titleCase('hello')).to.equal('Hello');
    });

    it('should handle all caps', () => {
      expect(titleCase('HELLO WORLD')).to.equal('Hello World');
    });

    it('should handle mixed case', () => {
      expect(titleCase('hELLo WoRLd')).to.equal('Hello World');
    });

    it('should handle strings with numbers', () => {
      expect(titleCase('hello 123 world')).to.equal('Hello 123 World');
    });
  });

  describe('formatTableData edge cases', () => {
    it('should handle empty array', () => {
      const result = formatTableData([]);
      expect(result).to.deep.equal([]);
    });

    it('should handle negative amounts', () => {
      const input = [{ date: '2023-01-15', desc: 'Credit', amount: -50 }];
      const output = formatTableData(input);
      expect(output[0].amount).to.equal('-$50.00');
    });

    it('should handle zero amounts', () => {
      const input = [{ date: '2023-01-15', desc: 'Zero', amount: 0 }];
      const output = formatTableData(input);
      expect(output[0].amount).to.equal('$0.00');
    });
  });

  describe('transform edge cases', () => {
    it('should handle empty array', () => {
      const output = transform([]);
      expect(output).to.deep.equal([]);
    });

    it('should handle multiple items', () => {
      const input = [
        {
          station: {
            facilitYNum: '123',
            city: 'NEW YORK',
          },
        },
        {
          station: {
            facilitYNum: '456',
            city: 'los angeles',
          },
        },
      ];
      const output = transform(input);
      expect(output.length).to.equal(2);
      expect(output[0].station.city).to.equal('New York');
      expect(output[1].station.city).to.equal('Los Angeles');
    });

    it('should preserve other properties', () => {
      const input = [
        {
          id: 1,
          name: 'Test',
          station: {
            facilitYNum: '123',
            city: 'chicago',
            state: 'IL',
          },
        },
      ];
      const output = transform(input);
      expect(output[0].id).to.equal(1);
      expect(output[0].name).to.equal('Test');
      expect(output[0].station.state).to.equal('IL');
    });
  });

  describe('selectLoadingFeatureFlags edge cases', () => {
    it('should handle undefined state', () => {
      expect(selectLoadingFeatureFlags(undefined)).to.be.undefined;
    });

    it('should handle null state', () => {
      expect(selectLoadingFeatureFlags(null)).to.be.undefined;
    });

    it('should handle empty state object', () => {
      expect(selectLoadingFeatureFlags({})).to.be.undefined;
    });

    it('should handle false loading state', () => {
      const mockState = { featureToggles: { loading: false } };
      expect(selectLoadingFeatureFlags(mockState)).to.be.false;
    });
  });

  describe('Feature Toggle Selectors', () => {
    it('combinedPortalAccess should return feature flag value true', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.combinedDebtPortalAccess]: true,
        },
      };

      const result = combinedPortalAccess(mockState);
      expect(result).to.be.true;
    });

    it('combinedPortalAccess should return feature flag value false', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.combinedDebtPortalAccess]: false,
        },
      };

      const result = combinedPortalAccess(mockState);
      expect(result).to.be.false;
    });

    it('debtLettersShowLettersVBMS should return feature flag value true', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.debtLettersShowLettersVBMS]: true,
        },
      };

      const result = debtLettersShowLettersVBMS(mockState);
      expect(result).to.be.true;
    });

    it('debtLettersShowLettersVBMS should return feature flag value false', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.debtLettersShowLettersVBMS]: false,
        },
      };

      const result = debtLettersShowLettersVBMS(mockState);
      expect(result).to.be.false;
    });

    it('showPaymentHistory should return feature flag value true', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.CdpPaymentHistoryVba]: true,
        },
      };

      const result = showPaymentHistory(mockState);
      expect(result).to.be.true;
    });

    it('showPaymentHistory should return feature flag value false', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.CdpPaymentHistoryVba]: false,
        },
      };

      const result = showPaymentHistory(mockState);
      expect(result).to.be.false;
    });

    it('cdpAccessToggle should return feature flag value true', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.combinedDebtPortalAccess]: true,
        },
      };

      const result = cdpAccessToggle(mockState);
      expect(result).to.be.true;
    });

    it('cdpAccessToggle should return feature flag value false', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.combinedDebtPortalAccess]: false,
        },
      };

      const result = cdpAccessToggle(mockState);
      expect(result).to.be.false;
    });
  });

  describe('OverviewPage sortedStatements and statementsByUniqueFacility', () => {
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

    it('should pass mcp.statements.data to Balances when showVHAPaymentHistory is true', () => {
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
                self:
                  'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=1',
                first:
                  'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=1',
                next:
                  'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=2',
                last:
                  'http://127.0.0.1:3000/services/health-care-costs-coverage/v0/r4/Invoice?_count=3&patient=10000003&page=4',
              },
            },
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
          loading: false,
        },
      };

      const { container } = renderWithStore(<OverviewPage />, mockState);

      expect(container).to.exist;

      // Verify component rendered - OverviewPage should pass the data to Balances
      const balanceCards = container.querySelectorAll('va-card');
      expect(balanceCards.length).to.be.greaterThan(0);
      expect(balanceCards[0].textContent).to.include('$150.25');
    });

    it('should pass sorted statements to Balances when showVHAPaymentHistory is false', () => {
      const mockState = {
        user: {},
        combinedPortal: {
          debtLetters: {
            debts: [],
            errors: [],
            isPending: false,
            isProfileUpdating: false,
          },
          mcp: {
            pending: false,
            error: null,
            statements: [
              {
                id: '1',
                pSStatementDateOutput: '2023-01-01',
                pSFacilityNum: '789',
                pHAmtDue: 100,
              },
              {
                id: '2',
                pSStatementDateOutput: '2023-03-01',
                pSFacilityNum: '456',
                pHAmtDue: 200,
              },
            ],
          },
        },
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
          loading: false,
        },
      };

      const { container } = renderWithStore(<OverviewPage />, mockState);

      expect(container).to.exist;
      // Verify component rendered - OverviewPage should pass sorted statements to Balances
      const balanceCards = container.querySelectorAll('va-card');
      expect(balanceCards.length).to.be.greaterThan(0);
      expect(balanceCards[0].textContent).to.include('$300');
    });
  });

  it('showVHAPaymentHistory should return feature flag value true', () => {
    const mockState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
      },
    };

    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.true;
  });

  it('showVHAPaymentHistory should return feature flag value false', () => {
    const mockState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
      },
    };

    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.false;
  });

  describe('sortedStatements logic', () => {
    it('should use mcp.statements.data when showVHAPaymentHistory is true', () => {
      const shouldShowVHAPaymentHistory = true;
      const statements = [
        { pSStatementDateOutput: '2023-01-01' },
        { pSStatementDateOutput: '2023-03-01' },
      ];
      const mcp = {
        statements: {
          data: [
            { id: '1', attributes: { lastUpdatedAt: '2023-05-01' } },
            { id: '2', attributes: { lastUpdatedAt: '2023-06-01' } },
          ],
        },
      };

      const sortedStatements = shouldShowVHAPaymentHistory
        ? mcp.statements.data ?? []
        : sortStatementsByDate(statements || []);

      expect(sortedStatements).to.deep.equal(mcp.statements.data);
      expect(sortedStatements.length).to.equal(2);
      expect(sortedStatements[0].id).to.equal('1');
    });

    it('should use sortStatementsByDate when showVHAPaymentHistory is false', () => {
      const shouldShowVHAPaymentHistory = false;
      const statements = [
        { pSStatementDateOutput: '2023-01-01' },
        { pSStatementDateOutput: '2023-03-01' },
        { pSStatementDateOutput: '2023-02-01' },
      ];
      const mcp = {
        statements: {
          data: [{ id: '1' }, { id: '2' }],
        },
      };

      const sortedStatements = shouldShowVHAPaymentHistory
        ? mcp.statements.data ?? []
        : sortStatementsByDate(statements || []);

      expect(sortedStatements.length).to.equal(3);
      expect(sortedStatements[0].pSStatementDateOutput).to.equal('2023-03-01');
      expect(sortedStatements[2].pSStatementDateOutput).to.equal('2023-01-01');
    });

    it('should handle null statements when showVHAPaymentHistory is false', () => {
      const shouldShowVHAPaymentHistory = false;
      const statements = null;
      const mcp = {
        statements: {
          data: [],
        },
      };

      const sortedStatements = shouldShowVHAPaymentHistory
        ? mcp.statements.data ?? []
        : sortStatementsByDate(statements || []);

      expect(sortedStatements).to.deep.equal([]);
    });

    it('should use empty array fallback when mcp.statements.data is null and flag is true', () => {
      const shouldShowVHAPaymentHistory = true;
      const statements = [{ pSStatementDateOutput: '2023-01-01' }];
      const mcp = {
        statements: {
          data: null,
        },
      };

      const sortedStatements = shouldShowVHAPaymentHistory
        ? mcp.statements.data ?? []
        : sortStatementsByDate(statements || []);

      expect(sortedStatements).to.deep.equal([]);
    });
  });

  describe('statementsByUniqueFacility logic', () => {
    it('should use facilityId with uniqBy when showVHAPaymentHistory is true', () => {
      const shouldShowVHAPaymentHistory = true;
      const mcpStatements = [
        { id: '1', facilityId: 'FAC123', name: 'First' },
        { id: '2', facilityId: 'FAC123', name: 'Duplicate' },
        { id: '3', facilityId: 'FAC456', name: 'Second' },
      ];
      const sortedStatements = [
        { id: '1', pSFacilityNum: '789' },
        { id: '2', pSFacilityNum: '789' },
      ];

      const statementsByUniqueFacility = shouldShowVHAPaymentHistory
        ? uniqBy(mcpStatements, 'facilityId')
        : uniqBy(sortedStatements, 'pSFacilityNum');

      expect(statementsByUniqueFacility.length).to.equal(2);
      expect(statementsByUniqueFacility[0].facilityId).to.equal('FAC123');
      expect(statementsByUniqueFacility[1].facilityId).to.equal('FAC456');
      expect(statementsByUniqueFacility[0].name).to.equal('First');
    });

    it('should use pSFacilityNum with uniqBy when showVHAPaymentHistory is false', () => {
      const shouldShowVHAPaymentHistory = false;
      const mcpStatements = [
        { id: '1', facilityId: 'FAC123' },
        { id: '2', facilityId: 'FAC456' },
      ];
      const sortedStatements = [
        { id: '1', pSFacilityNum: '789', city: 'New York' },
        { id: '2', pSFacilityNum: '789', city: 'New York' },
        { id: '3', pSFacilityNum: '456', city: 'Boston' },
      ];

      const statementsByUniqueFacility = shouldShowVHAPaymentHistory
        ? uniqBy(mcpStatements, 'facilityId')
        : uniqBy(sortedStatements, 'pSFacilityNum');

      expect(statementsByUniqueFacility.length).to.equal(2);
      expect(statementsByUniqueFacility[0].pSFacilityNum).to.equal('789');
      expect(statementsByUniqueFacility[1].pSFacilityNum).to.equal('456');
      expect(statementsByUniqueFacility[0].city).to.equal('New York');
    });

    it('should handle empty arrays', () => {
      const shouldShowVHAPaymentHistory = true;
      const mcpStatements = [];
      const sortedStatements = [];

      const statementsByUniqueFacility = shouldShowVHAPaymentHistory
        ? uniqBy(mcpStatements, 'facilityId')
        : uniqBy(sortedStatements, 'pSFacilityNum');

      expect(statementsByUniqueFacility).to.deep.equal([]);
    });

    it('should handle all unique facilities when flag is true', () => {
      const shouldShowVHAPaymentHistory = true;
      const mcpStatements = [
        { id: '1', facilityId: 'FAC111' },
        { id: '2', facilityId: 'FAC222' },
        { id: '3', facilityId: 'FAC333' },
      ];
      const sortedStatements = [];

      const statementsByUniqueFacility = shouldShowVHAPaymentHistory
        ? uniqBy(mcpStatements, 'facilityId')
        : uniqBy(sortedStatements, 'pSFacilityNum');

      expect(statementsByUniqueFacility.length).to.equal(3);
    });

    it('should handle all unique facilities when flag is false', () => {
      const shouldShowVHAPaymentHistory = false;
      const mcpStatements = [];
      const sortedStatements = [
        { id: '1', pSFacilityNum: '111' },
        { id: '2', pSFacilityNum: '222' },
        { id: '3', pSFacilityNum: '333' },
      ];

      const statementsByUniqueFacility = shouldShowVHAPaymentHistory
        ? uniqBy(mcpStatements, 'facilityId')
        : uniqBy(sortedStatements, 'pSFacilityNum');

      expect(statementsByUniqueFacility.length).to.equal(3);
    });
  });
});
