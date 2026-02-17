import { expect } from 'chai';
import sinon from 'sinon-v20';

import {
  validateCurrency,
  validateDependentDate,
  validateGulfWarDates,
  validateAgentOrangeExposureDates,
  validateExposureDates,
  validatePolicyNumberGroupCode,
  validateMarriageDate,
  validateServiceDates,
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

  context('when `validateMarriageDate` executes', () => {
    context('when form data is valid', () => {
      it('should not set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateMarriageDate(errors, '2010-01-01', {
          spouseDateOfBirth: '2009-12-31',
        });
        expect(errors.addError.called).to.be.false;
      });
    });

    context('when birth date is after marriage date', () => {
      it('should set error message', () => {
        const errors = {
          addError: sinon.spy(),
        };
        validateMarriageDate(errors, '2010-01-01', {
          spouseDateOfBirth: '2011-01-01',
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

  context(
    'when `validateGulfWarDates`, `validateAgentOrangeExposureDates`, and `validateExposureDates` executes',
    () => {
      const getData = ({
        startDate = '1998-04-XX',
        endDate = '1999-01-XX',
        startDateField = '',
        endDateField = '',
      }) => {
        const startDateSpy = sinon.spy();
        const endDateSpy = sinon.spy();

        return {
          errors: {
            [startDateField]: {
              addError: startDateSpy,
            },
            [endDateField]: {
              addError: endDateSpy,
            },
          },
          fieldData: {
            [startDateField]: startDate,
            [endDateField]: endDate,
          },
          startDateSpy,
          endDateSpy,
        };
      };

      const testCases = [
        {
          validatorFn: validateGulfWarDates,
          startDateField: 'gulfWarStartDate',
          endDateField: 'gulfWarEndDate',
        },
        {
          validatorFn: validateAgentOrangeExposureDates,
          startDateField: 'agentOrangeStartDate',
          endDateField: 'agentOrangeEndDate',
        },
        {
          validatorFn: validateExposureDates,
          startDateField: 'toxicExposureStartDate',
          endDateField: 'toxicExposureEndDate',
        },
      ];

      testCases.forEach(test => {
        context('when valid data is provided', () => {
          context('when the start date is prior to the end date', () => {
            it('should not set an error message', () => {
              const { errors, fieldData, startDateSpy, endDateSpy } = getData(
                test,
              );

              it('should not set error message', () => {
                test.validatorFn(errors, fieldData);
                expect(startDateSpy.called).to.be.false;
                expect(endDateSpy.called).to.be.false;
              });
            });

            context('when the start date is the same as the end date', () => {
              const { errors, fieldData, startDateSpy, endDateSpy } = getData({
                ...test,
                startDate: '1998-04-XX',
                endDate: '1998-04-XX',
              });

              it('should not set error message', () => {
                test.validatorFn(errors, fieldData);
                expect(startDateSpy.called).to.be.false;
                expect(endDateSpy.called).to.be.false;
              });
            });

            context(
              'when no month is given and the start year is the same as the end year',
              () => {
                const { errors, fieldData, startDateSpy, endDateSpy } = getData(
                  {
                    ...test,
                    startDate: '1998-XX-XX',
                    endDate: '1998-XX-XX',
                  },
                );

                it('should not set error message', () => {
                  test.validatorFn(errors, fieldData);
                  expect(startDateSpy.called).to.be.false;
                  expect(endDateSpy.called).to.be.false;
                });
              },
            );
          });
        });

        context('when invalid data is provided', () => {
          context('when end date is before start date', () => {
            const { errors, fieldData, startDateSpy, endDateSpy } = getData({
              ...test,
              startDate: '1998-04-XX',
              endDate: '1998-03-XX',
            });

            it('should set an error message', () => {
              test.validatorFn(errors, fieldData);
              expect(startDateSpy.called).to.be.false;
              expect(endDateSpy.called).to.be.true;
            });
          });

          context(
            'when only given the year and the end year is before the start year',
            () => {
              const { errors, fieldData, startDateSpy, endDateSpy } = getData({
                ...test,
                startDate: '1998-XX-XX',
                endDate: '1997-XX-XX',
              });

              it('should set an error message', () => {
                test.validatorFn(errors, fieldData);
                expect(startDateSpy.called).to.be.false;
                expect(endDateSpy.called).to.be.true;
              });
            },
          );

          context('when a year is not provided for the start date', () => {
            const { errors, fieldData, startDateSpy, endDateSpy } = getData({
              ...test,
              startDate: 'XXXX-04-XX',
              endDate: '1998-03-XX',
            });

            it('should set an error message', () => {
              test.validatorFn(errors, fieldData);
              /*
              When there's no year for the start date, an end date validation error is also
              thrown because the year for the end date is being compared to a blank value.
              */
              expect(startDateSpy.called).to.be.true;
              expect(endDateSpy.called).to.be.true;
            });
          });

          context('when a year is not provided for the end date', () => {
            const { errors, fieldData, startDateSpy, endDateSpy } = getData({
              ...test,
              startDate: '1997-04-XX',
              endDate: 'XXXX-03-XX',
            });

            it('should set an error message', () => {
              test.validatorFn(errors, fieldData);
              expect(startDateSpy.called).to.be.false;
              expect(endDateSpy.called).to.be.true;
            });
          });
        });
      });
    },
  );
});

describe('ezr `validateServiceDates` form validation', () => {
  const dischargeDateSpy = sinon.spy();
  const entryDateSpy = sinon.spy();
  const getData = ({
    dischargeDate = '2016-01-01',
    entryDate = '2011-01-01',
    birthdate = '1980-01-01',
  }) => ({
    errors: {
      lastDischargeDate: { addError: dischargeDateSpy },
      lastEntryDate: { addError: entryDateSpy },
    },
    fieldData: {
      lastDischargeDate: dischargeDate,
      lastEntryDate: entryDate,
    },
    formData: {
      veteranDateOfBirth: birthdate,
    },
  });

  afterEach(() => {
    dischargeDateSpy.resetHistory();
    entryDateSpy.resetHistory();
  });

  it('should not set error message when form data is valid', () => {
    const { errors, fieldData, formData } = getData({});
    validateServiceDates(errors, fieldData, formData);
    expect(dischargeDateSpy.called).to.be.false;
    expect(entryDateSpy.called).to.be.false;
  });

  it('should set error message when discharge date is before entry date', () => {
    const { errors, fieldData, formData } = getData({
      dischargeDate: '2010-01-01',
    });
    validateServiceDates(errors, fieldData, formData);
    expect(dischargeDateSpy.called).to.be.true;
  });

  it('should set error message when entry date is less than 15 years after birthdate', () => {
    const { errors, fieldData, formData } = getData({
      dischargeDate: '2010-03-01',
      entryDate: '2000-01-01',
      birthdate: '1990-01-01',
    });
    validateServiceDates(errors, fieldData, formData);
    expect(entryDateSpy.called).to.be.true;
  });
});
