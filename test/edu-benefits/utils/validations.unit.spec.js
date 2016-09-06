import { expect } from 'chai';

import { isValidSeparatedDateField } from '../../../src/js/edu-benefits/utils/validations.js';

describe('Validations unit tests', () => {
  describe('isValidSeparatedDateField', () => {
    it('validates if separated date is after entered date', () => {
      const dateEntered = {
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
      const dateSeparated = {
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
      expect(isValidSeparatedDateField(dateSeparated, dateEntered)).to.be.true;
    });
    it('does not validate separated date is before entered date', () => {
      const dateEntered = {
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
      const dateSeparated = {
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
      expect(isValidSeparatedDateField(dateSeparated, dateEntered)).to.be.false;
    });
  });
});
