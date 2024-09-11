import { expect } from 'chai';
import moment from 'moment';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import {
  APP_TYPES,
  ALERT_TYPES,
  API_RESPONSES,
  selectLoadingFeatureFlags,
  formatDate,
  currency,
  formatTableData,
  calcDueDate,
  titleCase,
  verifyCurrentBalance,
  sortStatementsByDate,
  transform,
  setPageFocus,
} from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('APP_TYPES', () => {
    it('should have correct values', () => {
      expect(APP_TYPES.DEBT).to.equal('DEBT');
      expect(APP_TYPES.COPAY).to.equal('COPAY');
    });
  });

  describe('ALERT_TYPES', () => {
    it('should have correct values', () => {
      expect(ALERT_TYPES.ALL_ERROR).to.equal('ALL_ERROR');
      expect(ALERT_TYPES.ALL_ZERO).to.equal('ALL_ZERO');
      expect(ALERT_TYPES.ERROR).to.equal('ERROR');
      expect(ALERT_TYPES.ZERO).to.equal('ZERO');
    });
  });

  describe('API_RESPONSES', () => {
    it('should have correct values', () => {
      expect(API_RESPONSES.ERROR).to.equal(-1);
    });
  });

  describe('selectLoadingFeatureFlags', () => {
    it('should return loading state of feature flags', () => {
      const mockState = { featureToggles: { loading: true } };
      expect(selectLoadingFeatureFlags(mockState)).to.be.true;
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      expect(formatDate('2023-01-15')).to.equal('January 14, 2023');
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
  });

  describe('calcDueDate', () => {
    it('should calculate due date correctly', () => {
      expect(calcDueDate('01-15-2024', 30)).to.equal('February 14, 2024');
    });

    it('should handle month and year transitions correctly', () => {
      expect(calcDueDate('12-15-2023', 30)).to.equal('January 14, 2024');
      expect(calcDueDate('01-31-2024', 30)).to.equal('March 1, 2024');
    });
  });

  describe('titleCase', () => {
    it('should convert string to title case', () => {
      expect(titleCase('hello world')).to.equal('Hello World');
    });
  });

  describe('verifyCurrentBalance', () => {
    it('should return true if current date is on or before due date', () => {
      const futureDate = moment()
        .add(1, 'month')
        .format('MM-DD-YYYY');
      expect(verifyCurrentBalance(futureDate)).to.be.true;
    });

    it('should return false if current date is after due date', () => {
      const pastDate = moment()
        .subtract(1, 'month')
        .format('MM-DD-YYYY');
      expect(verifyCurrentBalance(pastDate)).to.be.false;
    });
  });

  describe('sortStatementsByDate', () => {
    it('should sort statements by date in descending order', () => {
      const statements = [
        { pSStatementDate: '01-15-2023' },
        { pSStatementDate: '02-15-2023' },
        { pSStatementDate: '12-15-2022' },
      ];
      const sorted = sortStatementsByDate(statements);
      expect(sorted[0].pSStatementDate).to.equal('02-15-2023');
      expect(sorted[2].pSStatementDate).to.equal('12-15-2022');
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
});
