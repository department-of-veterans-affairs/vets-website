import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import {
  validateServiceDates,
  validateDependentDate,
  validateV2DependentDate,
  validateCurrency,
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

  // NOTE: for household v1 only -- remove after v2 is fully-adopted
  describe('when `validateDependentDate` executes', () => {
    describe('when disclosing financial data', () => {
      describe('when form data is valid', () => {
        it('should set error message', () => {
          const errors = {
            addError: sinon.spy(),
          };
          validateDependentDate(
            errors,
            '2010-01-01',
            {
              discloseFinancialInformation: true,
              children: [{ childDateOfBirth: '2009-12-31' }],
            },
            null,
            null,
            0,
          );
          expect(errors.addError.callCount).to.equal(1);
        });
      });

      describe('when birth date is after dependent date', () => {
        it('should set error message', () => {
          const errors = {
            addError: sinon.spy(),
          };
          validateDependentDate(
            errors,
            '2010-01-01',
            {
              discloseFinancialInformation: true,
              children: [{ childDateOfBirth: '2011-01-01' }],
            },
            null,
            null,
            0,
          );
          expect(errors.addError.callCount).to.equal(1);
        });
      });
    });

    describe('when not disclosing financial data', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateDependentDate(
          errors,
          '2010-01-01',
          {
            discloseFinancialInformation: false,
            children: [{ childDateOfBirth: '2011-01-01' }],
          },
          null,
          null,
          0,
        );
        expect(errors.addError.callCount).to.equal(0);
      });
    });
  });

  // NOTE: for household v2 only -- rename when v2 is fully-adopted
  describe('when `validateV2DependentDate` executes', () => {
    describe('when form data is valid', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateV2DependentDate(errors, '2010-01-01', {
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
        validateV2DependentDate(errors, '2010-01-01', {
          dateOfBirth: '2011-01-01',
        });
        expect(errors.addError.callCount).to.equal(1);
      });
    });
  });

  // NOTE: for household v1 only -- remove after v2 is fully-adopted
  describe('when `validateCurrency` executes', () => {
    describe('when form data is valid', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '234.23');
        expect(errors.addError.callCount).to.equal(0);
      });
    });

    describe('when value has three decimals', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '234.234');
        expect(errors.addError.callCount).to.equal(1);
      });
    });

    describe('when value has trailing whitespace', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '234234 ');
        expect(errors.addError.callCount).to.equal(1);
      });
    });

    describe('when value has leading whitespace', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, ' 234234');
        expect(errors.addError.callCount).to.equal(1);
      });
    });

    describe('when value includes dollar sign', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '$234,234');
        expect(errors.addError.callCount).to.equal(0);
      });
    });
  });
});
