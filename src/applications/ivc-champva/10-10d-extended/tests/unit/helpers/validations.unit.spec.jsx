import sinon from 'sinon-v20';
import { expect } from 'chai';
import {
  validateHealthInsurancePlan,
  validateMarriageAfterDob,
  validateMedicarePartDDates,
  validateOHIDates,
} from '../../../helpers/validations';

describe('1010d `validateMarriageAfterDob` form validation', () => {
  let errors;

  beforeEach(() => {
    errors = {
      dateOfMarriageToSponsor: {
        addError: sinon.spy(),
      },
    };
  });

  it('should add an error when applicant dob is after date of marriage', () => {
    const page = {
      applicantDob: '2000-01-01',
      dateOfMarriageToSponsor: '1999-01-01',
    };

    validateMarriageAfterDob(errors, page);
    expect(errors.dateOfMarriageToSponsor.addError.calledOnce).to.be.true;
  });

  it('should add an error when applicant dob is same as date of marriage', () => {
    const page = {
      applicantDob: '2000-01-01',
      dateOfMarriageToSponsor: '2000-01-01',
    };

    validateMarriageAfterDob(errors, page);
    expect(errors.dateOfMarriageToSponsor.addError.calledOnce).to.be.true;
  });

  it('should NOT add an error when applicant dob is before date of marriage', () => {
    const page = {
      applicantDob: '1995-01-01',
      dateOfMarriageToSponsor: '2020-01-01',
    };

    validateMarriageAfterDob(errors, page);
    expect(errors.dateOfMarriageToSponsor.addError.called).to.be.false;
  });

  it('should NOT add an error when date of marriage is undefined', () => {
    const page = {
      applicantDob: '1995-01-01',
      dateOfMarriageToSponsor: undefined,
    };

    validateMarriageAfterDob(errors, page);
    expect(errors.dateOfMarriageToSponsor.addError.called).to.be.false;
  });

  it('should NOT add an error when date of birth is undefined', () => {
    const page = {
      applicantDob: undefined,
      dateOfMarriageToSponsor: '2000-01-01',
    };

    validateMarriageAfterDob(errors, page);
    expect(errors.dateOfMarriageToSponsor.addError.called).to.be.false;
  });
});

describe('1010d `validateMedicarePartDDates` form validation', () => {
  const terminationDateSpy = sinon.spy();
  const effectiveDateSpy = sinon.spy();
  const getData = ({
    terminationDate = '2016-01-01',
    effectiveDate = '2011-01-01',
  } = {}) => ({
    errors: {
      medicarePartDTerminationDate: { addError: terminationDateSpy },
      medicarePartDEffectiveDate: { addError: effectiveDateSpy },
    },
    fieldData: {
      medicarePartDTerminationDate: terminationDate,
      medicarePartDEffectiveDate: effectiveDate,
    },
  });

  afterEach(() => {
    terminationDateSpy.resetHistory();
    effectiveDateSpy.resetHistory();
  });

  it('should not set error message when form data is valid', () => {
    const { errors, fieldData } = getData();
    validateMedicarePartDDates(errors, fieldData);
    sinon.assert.notCalled(terminationDateSpy);
    sinon.assert.notCalled(effectiveDateSpy);
  });

  it('should not set error message when termination date is omitted', () => {
    const { errors, fieldData } = getData({ terminationDate: undefined });
    validateMedicarePartDDates(errors, fieldData);
    sinon.assert.notCalled(terminationDateSpy);
    sinon.assert.notCalled(effectiveDateSpy);
  });

  it('should set error message when termination date is invalid', () => {
    const { errors, fieldData } = getData({
      terminationDate: '2018-XX-01',
    });
    validateMedicarePartDDates(errors, fieldData);
    sinon.assert.calledOnce(terminationDateSpy);
  });

  it('should set error message when termination date is before effective date', () => {
    const { errors, fieldData } = getData({
      terminationDate: '2010-01-01',
    });
    validateMedicarePartDDates(errors, fieldData);
    sinon.assert.calledOnce(terminationDateSpy);
  });
});

describe('1010d `validateOHIDates` form validation', () => {
  const expirationDateSpy = sinon.spy();
  const effectiveDateSpy = sinon.spy();
  const getData = ({
    expirationDate = '2016-01-01',
    effectiveDate = '2011-01-01',
  } = {}) => ({
    errors: {
      expirationDate: { addError: expirationDateSpy },
      effectiveDate: { addError: effectiveDateSpy },
    },
    fieldData: { expirationDate, effectiveDate },
  });

  afterEach(() => {
    expirationDateSpy.resetHistory();
    effectiveDateSpy.resetHistory();
  });

  it('should not set error message when form data is valid', () => {
    const { errors, fieldData } = getData();
    validateOHIDates(errors, fieldData);
    sinon.assert.notCalled(expirationDateSpy);
    sinon.assert.notCalled(effectiveDateSpy);
  });

  it('should not set error message when termination date is omitted', () => {
    const { errors, fieldData } = getData({ expirationDate: undefined });
    validateOHIDates(errors, fieldData);
    sinon.assert.notCalled(expirationDateSpy);
    sinon.assert.notCalled(effectiveDateSpy);
  });

  it('should set error message when termination date is invalid', () => {
    const { errors, fieldData } = getData({
      expirationDate: '2018-XX-01',
    });
    validateOHIDates(errors, fieldData);
    sinon.assert.calledOnce(expirationDateSpy);
  });

  it('should set error message when termination date is before effective date', () => {
    const { errors, fieldData } = getData({
      expirationDate: '2010-01-01',
    });
    validateOHIDates(errors, fieldData);
    sinon.assert.calledOnce(expirationDateSpy);
  });
});

describe('1010d `validateHealthInsurancePlan` form validation', () => {
  const PARTICIPANTS_VALID = { hash1: true, hash2: false };
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
    healthcareParticipants: PARTICIPANTS_VALID,
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

  context('Healthcare participants validation', () => {
    [
      { name: 'omitted', value: undefined },
      { name: 'not selected', value: { hash1: false, hash2: false } },
      { name: 'empty object', value: {} },
      { name: 'wrong type', value: 'not-an-object' },
    ].forEach(({ name, value }) => {
      it(`should return "true" when healthcare participant(s) is ${name}`, () => {
        const item = makeItem({ healthcareParticipants: value });
        expect(validateHealthInsurancePlan(item)).to.be.true;
      });
    });
  });

  context('Additional comments validation', () => {
    it('should return "false" when additional comments is within character limit', () => {
      const item = makeItem({ additionalComments: 'Under 200 chars.' });
      expect(validateHealthInsurancePlan(item)).to.be.false;
    });

    it('should return "true" when additional comments exceeds character limit', () => {
      const longComment = 'a'.repeat(201);
      const item = makeItem({ additionalComments: longComment });
      expect(validateHealthInsurancePlan(item)).to.be.true;
    });

    it('should return "false" when additional comments is undefined', () => {
      const item = makeItem({ additionalComments: undefined });
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
