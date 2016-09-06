import { expect } from 'chai';

import { isValidDateRange } from '../../../src/js/edu-benefits/utils/validations.js';

describe('Validations unit tests', () => {
  describe('isValidDateRange', () => {
    it('validates if to date is after from date', () => {
      const fromDate = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: 2006,
          dirty: true
        }
      };
      const toDate = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 4,
          dirty: true
        },
        year: {
          value: 2006,
          dirty: true
        }
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
    it('does not validate to date is before from date', () => {
      const fromDate = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: 2006,
          dirty: true
        }
      };
      const toDate = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 4,
          dirty: true
        },
        year: {
          value: 2005,
          dirty: true
        }
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.false;
    });
  });
});
