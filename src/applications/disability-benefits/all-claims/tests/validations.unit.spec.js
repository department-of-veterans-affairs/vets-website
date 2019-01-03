import sinon from 'sinon';
import { expect } from 'chai';

import {
  isValidYear,
  oneDisabilityRequired,
  hasMonthYear,
} from '../validations';

describe('526 All Claims validations', () => {
  describe('isValidYear', () => {
    it('should add an error if the year is not a number', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, 'asdf');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year contains more than just four digits', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '1990asdf');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year is less than 1900', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '1899');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year is more than 3000', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '3001');
      expect(err.addError.called).to.be.true;
    });

    it('should not add an error if the year is between 1900 and 3000', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '2010');
      expect(err.addError.called).to.be.false;
    });

    it('should add an error if the year is in the future', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '2999');
      expect(err.addError.called).to.be.true;
    });
    describe('oneDisabilityRequired', () => {
      it('should not add an error if atleast one disability is selected', () => {
        const err = {
          addError: sinon.spy(),
        };
        const formData = {
          ratedDisabilities: [
            {
              'view:unemployabilityDisability': true,
            },
          ],
          newDisabilities: [
            {
              'view:unemployabilityDisability': false,
            },
          ],
        };
        oneDisabilityRequired('rated')(err, null, formData);
        expect(err.addError.called).to.be.false;
      });
      it('should add an error if no disabilities are selected', () => {
        const err = {
          addError: sinon.spy(),
        };
        const formData = {
          ratedDisabilities: [],
          newDisabilities: [],
        };
        oneDisabilityRequired('rated')(err, null, formData);
        expect(err.addError.called).to.be.true;
      });
    });
  });

  describe('hasMonthYear', () => {
    it('should add an error if the year is missing', () => {
      const err = {
        addError: sinon.spy(),
      };
      hasMonthYear(err, 'XXXX-12-XX');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the month is missing', () => {
      const err = {
        addError: sinon.spy(),
      };
      hasMonthYear(err, '1980-XX-XX');
      expect(err.addError.called).to.be.true;
    });

    it('should not add an error if the month and year are present', () => {
      const err = {
        addError: sinon.spy(),
      };
      hasMonthYear(err, '1980-12-XX');
      expect(err.addError.called).to.be.false;
    });
  });
});
