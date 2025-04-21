import { expect } from 'chai';
import { addMonths, subMonths } from 'date-fns';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
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

    it.skip('should return false if current date is after due date', () => {
      const pastDate = subMonths(new Date(), 1);
      expect(verifyCurrentBalance(pastDate)).to.be.false;
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
