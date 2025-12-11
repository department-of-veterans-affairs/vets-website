import sinon from 'sinon-v20';
import { validateDateRange } from '../../../utils/validation';

describe('10-7959C `validateDateRange` form validation', () => {
  let errors;
  let startDateSpy;
  let endDateSpy;

  beforeEach(() => {
    startDateSpy = sinon.spy();
    endDateSpy = sinon.spy();
    errors = {
      applicantMedicarePartDEffectiveDate: { addError: startDateSpy },
      applicantMedicarePartDTerminationDate: { addError: endDateSpy },
    };
  });

  afterEach(() => {
    startDateSpy.resetHistory();
    endDateSpy.resetHistory();
  });

  it('should not add error when dates are valid and in correct order', () => {
    const data = {
      applicantMedicarePartDEffectiveDate: '2020-01-01',
      applicantMedicarePartDTerminationDate: '2021-01-01',
    };

    validateDateRange(errors, data, {
      startDateKey: 'applicantMedicarePartDEffectiveDate',
      endDateKey: 'applicantMedicarePartDTerminationDate',
    });

    sinon.assert.notCalled(endDateSpy);
  });

  it('should not add error when termination date is omitted', () => {
    const data = {
      applicantMedicarePartDEffectiveDate: '2020-01-01',
      applicantMedicarePartDTerminationDate: undefined,
    };

    validateDateRange(errors, data, {
      startDateKey: 'applicantMedicarePartDEffectiveDate',
      endDateKey: 'applicantMedicarePartDTerminationDate',
    });

    sinon.assert.notCalled(endDateSpy);
  });

  it('should add error when termination date is before effective date', () => {
    const data = {
      applicantMedicarePartDEffectiveDate: '2021-01-01',
      applicantMedicarePartDTerminationDate: '2020-01-01',
    };

    validateDateRange(errors, data, {
      startDateKey: 'applicantMedicarePartDEffectiveDate',
      endDateKey: 'applicantMedicarePartDTerminationDate',
    });

    sinon.assert.calledOnce(endDateSpy);
  });

  it('should add error when termination date is invalid', () => {
    const data = {
      applicantMedicarePartDEffectiveDate: '2020-01-01',
      applicantMedicarePartDTerminationDate: 'invalid-date',
    };

    validateDateRange(errors, data, {
      startDateKey: 'applicantMedicarePartDEffectiveDate',
      endDateKey: 'applicantMedicarePartDTerminationDate',
    });

    sinon.assert.calledOnce(endDateSpy);
  });

  it('should add error when termination date is same as effective date', () => {
    const data = {
      applicantMedicarePartDEffectiveDate: '2020-01-01',
      applicantMedicarePartDTerminationDate: '2020-01-01',
    };

    validateDateRange(errors, data, {
      startDateKey: 'applicantMedicarePartDEffectiveDate',
      endDateKey: 'applicantMedicarePartDTerminationDate',
    });

    sinon.assert.calledOnce(endDateSpy);
  });

  it('should use custom error messages when provided', () => {
    const data = {
      applicantMedicarePartDEffectiveDate: '2021-01-01',
      applicantMedicarePartDTerminationDate: '2020-01-01',
    };
    const customMessage = 'Custom error message';

    validateDateRange(errors, data, {
      startDateKey: 'applicantMedicarePartDEffectiveDate',
      endDateKey: 'applicantMedicarePartDTerminationDate',
      rangeErrorMessage: customMessage,
    });

    sinon.assert.calledWith(endDateSpy, customMessage);
  });
});
