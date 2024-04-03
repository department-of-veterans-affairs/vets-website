import { expect } from 'chai';
import sinon from 'sinon';

import {
  validateCurrency,
  validateDependentDate,
  validateGulfWarDates,
  validatePolicyNumberGroupCode,
} from '../../../utils/validation';

describe('ezr validation utils', () => {
  context('when `validateDependentDate` executes', () => {
    context('when form data is valid', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateDependentDate(errors, '2010-01-01', {
          dateOfBirth: '2009-12-31',
        });
        expect(errors.addError.called).to.be.false;
      });
    });

    context('when birth date is after dependent date', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateDependentDate(errors, '2010-01-01', {
          dateOfBirth: '2011-01-01',
        });
        expect(errors.addError.called).to.be.true;
      });
    });
  });

  context('when `validateCurrency` executes', () => {
    context('when form data is valid', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '234.23');
        expect(errors.addError.called).to.be.false;
      });
    });

    context('when value has three decimals', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '234.234');
        expect(errors.addError.called).to.be.true;
      });
    });

    context('when value has trailing whitespace', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '234234 ');
        expect(errors.addError.called).to.be.true;
      });
    });

    context('when value has leading whitespace', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, ' 234234');
        expect(errors.addError.called).to.be.true;
      });
    });

    context('when value includes dollar sign', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateCurrency(errors, '$234,234');
        expect(errors.addError.called).to.be.false;
      });
    });
  });

  context('when `validatePolicyNumberGroupCode` executes', () => {
    context('when a valid policy number is provided', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validatePolicyNumberGroupCode(errors, {
          insurancePolicyNumber: '006655',
        });
        expect(errors.addError.called).to.be.false;
      });
    });

    context('when a valid group code is provided', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validatePolicyNumberGroupCode(errors, {
          insuranceGroupCode: '006655',
        });
        expect(errors.addError.called).to.be.false;
      });
    });

    context('when required fields are missing', () => {
      it('should set error message', () => {
        const errors = {
          insuranceGroupCode: {
            addError: sinon.spy(),
          },
          insurancePolicyNumber: {
            addError: sinon.spy(),
          },
        };
        validatePolicyNumberGroupCode(errors, {});
        expect(errors.insuranceGroupCode.addError.called).to.be.true;
        expect(errors.insurancePolicyNumber.addError.called).to.be.true;
      });
    });
  });

  context('when `validateGulfWarDates` executes', () => {
    const getData = ({
      spy = () => {},
      startDate = '1998-04-XX',
      endDate = '1999-01-XX',
      fieldName = 'gulfWarEndDate',
    }) => ({
      errors: {
        [fieldName]: {
          addError: spy,
        },
      },
      fieldData: {
        gulfWarStartDate: startDate,
        gulfWarEndDate: endDate,
      },
    });

    context('when valid data is provided', () => {
      context('when the start date is prior to the end date', () => {
        it('should not set an error message', () => {
          const spy = sinon.spy();
          const { errors, fieldData } = getData({ spy });

          it('should not set error message', () => {
            validateGulfWarDates(errors, fieldData);
            expect(spy.called).to.be.false;
          });
        });

        context('when the start date is the same as the end date', () => {
          const spy = sinon.spy();
          const { errors, fieldData } = getData({
            endDate: '1998-04-XX',
            spy,
          });

          it('should not set error message', () => {
            validateGulfWarDates(errors, fieldData);
            expect(spy.called).to.be.false;
          });
        });
      });
    });

    context('when invalid data is provided', () => {
      context('when end date is before start date', () => {
        const spy = sinon.spy();
        const { errors, fieldData } = getData({
          endDate: '1998-03-XX',
          spy,
        });

        it('should set an error message', () => {
          validateGulfWarDates(errors, fieldData);
          expect(spy.called).to.be.true;
        });
      });
    });
  });
});
