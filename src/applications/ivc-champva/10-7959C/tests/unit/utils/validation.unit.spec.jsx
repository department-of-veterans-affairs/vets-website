import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  validateChars,
  validateDateRange,
  validateFutureDate,
  validateHealthInsurancePlan,
} from '../../../utils/validation';

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

describe('10-7959C `validateFutureDate` form validation', () => {
  const NOW_ISO = '2026-01-06T12:00:00.000Z';
  const formData = {};
  const schema = {};
  let errors;
  let clock;

  const run = (dateString, errorMessages) =>
    validateFutureDate(errors, dateString, formData, schema, errorMessages);

  before(() => {
    clock = sinon.useFakeTimers(new Date(NOW_ISO));
  });

  after(() => {
    clock.restore();
  });

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  const noErrorCases = [
    { title: 'date is today', dateString: '2026-01-06' },
    { title: 'date is in the past', dateString: '2025-01-01' },
    { title: 'date is within one year from today', dateString: '2026-12-31' },
    { title: 'date is exactly one year from today', dateString: '2027-01-06' },
    { title: 'date is empty string', dateString: '' },
    { title: 'date is undefined', dateString: undefined },
  ];

  noErrorCases.forEach(({ title, dateString }) => {
    it(`should not add an error when ${title}`, () => {
      run(dateString);
      sinon.assert.notCalled(errors.addError);
    });
  });

  const errorCases = [
    {
      title: 'date is more than one year in the future',
      dateString: '2027-01-07',
    },
    { title: 'date is far in the future', dateString: '2030-01-01' },
    { title: 'date year exceeds maxYear', dateString: '2028-01-01' },
    { title: 'date has invalid month', dateString: '2026-13-01' },
    { title: 'date has invalid day', dateString: '2026-02-30' },
  ];

  errorCases.forEach(({ title, dateString }) => {
    it(`should add an error when ${title}`, () => {
      run(dateString);
      sinon.assert.calledOnce(errors.addError);
    });
  });
});

describe('10-7959c `validateHealthInsurancePlan` form validation', () => {
  const NOW_ISO_DATE = '2025-11-05';
  const FILES = {
    front: () => [{ name: 'front.pdf' }],
    back: () => [{ name: 'back.pdf' }],
    empty: () => [],
  };

  const toISO = d => new Date(d).toISOString().slice(0, 10);
  const YEARS = n => {
    const d = new Date(NOW_ISO_DATE);
    d.setFullYear(d.getFullYear() + n);
    return toISO(d);
  };

  const PAST_DATE = YEARS(-5);
  const FUTURE_DATE = YEARS(1);

  const BASE_VALID_ITEM = Object.freeze({
    insuranceType: 'ppo',
    provider: 'Cigna',
    effectiveDate: PAST_DATE,
    throughEmployer: true,
    eob: true,
    insuranceCardFront: FILES.front(),
    insuranceCardBack: FILES.back(),
  });

  const makeItem = (overrides = {}) => ({ ...BASE_VALID_ITEM, ...overrides });
  let clock;

  before(() => {
    clock = sinon.useFakeTimers(new Date(NOW_ISO_DATE).getTime());
  });

  after(() => {
    clock.restore();
  });

  context('Basic validation', () => {
    [
      { name: 'missing', value: undefined },
      { name: 'null', value: null },
      { name: 'empty', value: '' },
    ].forEach(({ name, value }) => {
      it(`should return "true" when insurance type is ${name}`, () => {
        const result = validateHealthInsurancePlan(
          makeItem({ insuranceType: value }),
        );
        expect(result).to.be.true;
      });
    });

    it('should gracefully handle empty item object', () => {
      expect(validateHealthInsurancePlan()).to.be.true;
    });

    it('should gracefully handle undefined item object', () => {
      expect(validateHealthInsurancePlan(undefined)).to.be.true;
    });
  });

  context('Core required fields', () => {
    it('should return "false" when all required fields are present and valid', () => {
      expect(validateHealthInsurancePlan(makeItem())).to.be.false;
    });

    it('should return "true" when provider is missing/empty', () => {
      expect(validateHealthInsurancePlan(makeItem({ provider: '' }))).to.be
        .true;
    });

    it('should return "true" when effective date is undefined', () => {
      expect(
        validateHealthInsurancePlan(makeItem({ effectiveDate: undefined })),
      ).to.be.true;
    });

    it('should return "true" when effective date is in the future', () => {
      expect(
        validateHealthInsurancePlan(makeItem({ effectiveDate: FUTURE_DATE })),
      ).to.be.true;
    });
  });

  context('Date validation', () => {
    it('should return "false" when expiration date is valid and after effective date', () => {
      const item = makeItem({
        effectiveDate: '2020-01-01',
        expirationDate: '2022-12-31',
      });
      expect(validateHealthInsurancePlan(item)).to.be.false;
    });

    it('should return "true" when expiration date is in the future', () => {
      const item = makeItem({
        effectiveDate: '2020-01-01',
        expirationDate: FUTURE_DATE,
      });
      expect(validateHealthInsurancePlan(item)).to.be.true;
    });

    it('should return "false" when expiration date is undefined', () => {
      const item = makeItem({ expirationDate: undefined });
      expect(validateHealthInsurancePlan(item)).to.be.false;
    });
  });

  context('Medigap plan validation', () => {
    it('should return "false" when medigap type & plan are valid', () => {
      const item = makeItem({
        insuranceType: 'medigap',
        medigapPlan: 'F',
        throughEmployer: false,
      });
      expect(validateHealthInsurancePlan(item)).to.be.false;
    });

    it('should return "true" when medigap type & plan is undefined', () => {
      const item = makeItem({
        insuranceType: 'medigap',
        medigapPlan: undefined,
        throughEmployer: false,
      });
      expect(validateHealthInsurancePlan(item)).to.be.true;
    });

    it('should return "false" when non-medigap type & plan is undefined', () => {
      const item = makeItem({ insuranceType: 'ppo', medigapPlan: undefined });
      expect(validateHealthInsurancePlan(item)).to.be.false;
    });
  });

  context('Boolean field validation', () => {
    [
      { field: 'throughEmployer', value: undefined },
      { field: 'eob', value: null },
    ].forEach(({ field, value }) => {
      it(`should return "true" when ${field} is ${
        value === null ? 'null' : 'undefined'
      }`, () => {
        const item = makeItem({ [field]: value });
        expect(validateHealthInsurancePlan(item)).to.be.true;
      });
    });

    it('should return "false" when booleans are false', () => {
      const item = makeItem({ throughEmployer: false, eob: false });
      expect(validateHealthInsurancePlan(item)).to.be.false;
    });
  });

  context('Card upload validation', () => {
    it('should return "true" when front card is omitted', () => {
      const item = makeItem({ insuranceCardFront: FILES.empty() });
      expect(validateHealthInsurancePlan(item)).to.be.true;
    });

    it('should return "true" when back card is omitted', () => {
      const item = makeItem({ insuranceCardBack: FILES.empty() });
      expect(validateHealthInsurancePlan(item)).to.be.true;
    });

    it('should return "true" when file object is missing name property', () => {
      const item = makeItem({ insuranceCardFront: [{}] });
      expect(validateHealthInsurancePlan(item)).to.be.true;
    });
  });
});

describe('10-7959C `validateChars` form validation', () => {
  let addErrorSpy;
  let errors;

  beforeEach(() => {
    addErrorSpy = sinon.spy();
    errors = { addError: addErrorSpy };
  });

  afterEach(() => {
    addErrorSpy.resetHistory();
  });

  it('should not add error when text contains only valid characters', () => {
    validateChars(errors, 'Valid text with letters and numbers 123');
    sinon.assert.notCalled(addErrorSpy);
  });

  it('should add error when text contains a single invalid character', () => {
    validateChars(errors, 'text with $ symbol');
    sinon.assert.calledOnce(addErrorSpy);
    sinon.assert.calledWith(addErrorSpy, sinon.match(/this character.*\$/));
  });

  it('should add error when text contains multiple invalid characters', () => {
    validateChars(errors, 'text with $@# symbols');
    sinon.assert.calledOnce(addErrorSpy);
    sinon.assert.calledWith(addErrorSpy, sinon.match(/these characters/));
  });

  it('should not add error for empty string', () => {
    validateChars(errors, '');
    sinon.assert.notCalled(addErrorSpy);
  });

  it('should allow hyphens, periods, apostrophes, and commas', () => {
    validateChars(errors, "Text with - . ' , allowed");
    sinon.assert.notCalled(addErrorSpy);
  });
});
