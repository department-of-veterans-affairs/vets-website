import { expect } from 'chai';

import { isValidDateRange, isValidFutureDateField } from '../../../src/js/edu-benefits/utils/validations.js';

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
  describe('isValidFutureDateField:', () => {
    it('validates if date is in the past', () => {
      const dateField = {
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
      expect(isValidFutureDateField(dateField)).to.be.true;
    });
    it('validates if date is in the future', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: (new Date()).getFullYear() + 1,
          dirty: true
        }
      };
      expect(isValidFutureDateField(dateField)).to.be.true;
    });
    it('does not validate if date is not valid', () => {
      const dateField = {
        day: {
          value: 3,
          dirty: true
        },
        month: {
          value: 3,
          dirty: true
        },
        year: {
          value: 'bad',
          dirty: true
        }
      };
      expect(isValidFutureDateField(dateField)).to.be.false;
    });
  });
});
