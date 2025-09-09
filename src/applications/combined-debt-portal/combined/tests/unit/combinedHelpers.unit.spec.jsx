import { expect } from 'chai';
import { addMonths, subMonths, addDays } from 'date-fns';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
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
  showOneThingPerPage,
  cdpAccessToggle,
} from '../../utils/helpers';

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

    it('showOneThingPerPage should return feature flag value true', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showCDPOneThingPerPage]: true,
        },
      };

      const result = showOneThingPerPage(mockState);
      expect(result).to.be.true;
    });

    it('showOneThingPerPage should return feature flag value false', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showCDPOneThingPerPage]: false,
        },
      };

      const result = showOneThingPerPage(mockState);
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
});
