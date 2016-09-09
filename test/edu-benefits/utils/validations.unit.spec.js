import { expect } from 'chai';

import { isValidDateRange, isValidFutureOrPastDateField, isValidPage } from '../../../src/js/edu-benefits/utils/validations.js';
import { createVeteran } from '../../../src/js/edu-benefits/utils/veteran.js';

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
  describe('isValidPage:', () => {
    describe('EmploymentHistory', () => {
      it('validates page without license is valid', () => {
        const veteran = createVeteran();
        veteran.hasNonMilitaryJobs.value = 'N';
        expect(isValidPage('/employment-history/employment-information', veteran)).to.be.true;
      });
      it('validtes page without occupation is not valid', () => {
        const veteran = createVeteran();
        veteran.hasNonMilitaryJobs.value = 'Y';
        veteran.nonMilitaryJobs.push({
          postMilitaryJob: {
            value: 'before',
            dirty: true
          },
          name: {
            value: '',
            dirty: false
          },
          months: {
            value: '',
            dirty: false
          }
        });
        expect(isValidPage('/employment-history/employment-information', veteran)).to.be.false;
      });
    });
  });
  describe('isValidFutureOrPastDateField:', () => {
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
      expect(isValidFutureOrPastDateField(dateField)).to.be.true;
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
      expect(isValidFutureOrPastDateField(dateField)).to.be.true;
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
      expect(isValidFutureOrPastDateField(dateField)).to.be.false;
    });
  });
});
