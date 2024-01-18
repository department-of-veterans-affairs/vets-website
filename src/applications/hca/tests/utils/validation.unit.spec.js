import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import {
  validateServiceDates,
  validateDependentDate,
} from '../../utils/validation';

describe('hca validation', () => {
  describe('when `validateServiceDates` executes', () => {
    describe('when form data is valid', () => {
      it('should not set error message ', () => {
        const errors = {
          lastDischargeDate: {
            addError: sinon.spy(),
          },
        };
        validateServiceDates(
          errors,
          {
            lastDischargeDate: '2016-01-01',
            lastEntryDate: '2011-01-01',
          },
          {
            veteranDateOfBirth: '1980-01-01',
          },
        );
        expect(errors.lastDischargeDate.addError.callCount).to.equal(0);
      });
    });

    describe('when discharge date is before entry date', () => {
      it('should set error message ', () => {
        const errors = {
          lastDischargeDate: {
            addError: sinon.spy(),
          },
        };
        validateServiceDates(
          errors,
          {
            lastDischargeDate: '2010-01-01',
            lastEntryDate: '2011-01-01',
          },
          {
            veteranDateOfBirth: '1980-01-01',
          },
        );
        expect(errors.lastDischargeDate.addError.callCount).to.equal(1);
      });
    });

    describe('when discharge date is later than 1 year from today', () => {
      it('should set error message', () => {
        const errors = {
          lastDischargeDate: {
            addError: sinon.spy(),
          },
        };
        validateServiceDates(
          errors,
          {
            lastDischargeDate: moment()
              .add(367, 'days')
              .format('YYYY-MM-DD'),
            lastEntryDate: '2011-01-01',
          },
          {},
        );
        expect(errors.lastDischargeDate.addError.callCount).to.equal(1);
      });
    });

    describe('when discharge date is exactly 1 year from today', () => {
      it('should not set message ', () => {
        const errors = {
          lastDischargeDate: {
            addError: sinon.spy(),
          },
        };
        validateServiceDates(
          errors,
          {
            lastDischargeDate: moment()
              .add(1, 'year')
              .format('YYYY-MM-DD'),
            lastEntryDate: '2011-01-01',
          },
          {},
        );
        expect(errors.lastDischargeDate.addError.callCount).to.equal(0);
      });
    });

    describe('when entry date is less than 15 years after date of birth', () => {
      it('should set error message ', () => {
        const errors = {
          lastEntryDate: {
            addError: sinon.spy(),
          },
        };
        validateServiceDates(
          errors,
          {
            lastDischargeDate: '2010-03-01',
            lastEntryDate: '2000-01-01',
          },
          {
            veteranDateOfBirth: '1990-01-01',
          },
        );
        expect(errors.lastEntryDate.addError.callCount).to.equal(1);
      });
    });
  });

  describe('when `validateDependentDate` executes', () => {
    describe('when form data is valid', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateDependentDate(errors, '2010-01-01', {
          dateOfBirth: '2009-12-31',
        });
        expect(errors.addError.callCount).to.equal(0);
      });
    });

    describe('when birth date is after dependent date', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateDependentDate(errors, '2010-01-01', {
          dateOfBirth: '2011-01-01',
        });
        expect(errors.addError.callCount).to.equal(1);
      });
    });
  });
});
