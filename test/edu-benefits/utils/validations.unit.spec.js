import { expect } from 'chai';

import { isValidDateRange, isValidFutureOrPastDateField, isValidPage, isValidRoutingNumber } from '../../../src/js/edu-benefits/utils/validations.js';
import { createVeteran, createPreviousClaim } from '../../../src/js/edu-benefits/utils/veteran.js';

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
      it('validates page with no data is valid', () => {
        const veteran = createVeteran();
        veteran.hasNonMilitaryJobs.value = 'Y';
        veteran.nonMilitaryJobs.push({
          postMilitaryJob: {
            value: '',
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
        expect(isValidPage('/employment-history/employment-information', veteran)).to.be.true;
      });
    });
    describe('PreviousClaims', () => {
      it('validates page with blank claim type', () => {
        const veteran = createVeteran();
        const previousClaim = createPreviousClaim();
        veteran.previousVaClaims.push(previousClaim);
        expect(isValidPage('/benefits-eligibility/previous-claims', veteran)).to.be.true;
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
  describe('isValidRoutingNumber', () => {
    const routingNumbers = [
      '211075086',
      '114926012',
      '061219694',
      '307086691',
      '302386587'
    ];
    const invalidRoutingNumbers = [
      'asdf',
      '12344',
      '923456890'
    ];
    it('should validate real routing numbers', () => {
      routingNumbers.forEach((num) => {
        expect(isValidRoutingNumber(num)).to.be.true;
      });
    });
    it('should not validate real routing numbers', () => {
      invalidRoutingNumbers.forEach((num) => {
        expect(isValidRoutingNumber(num)).to.be.false;
      });
    });
  });
});
