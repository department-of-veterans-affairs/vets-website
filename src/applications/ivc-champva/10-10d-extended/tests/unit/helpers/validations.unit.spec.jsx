import sinon from 'sinon-v20';
import { expect } from 'chai';
import {
  validateApplicant,
  validateHealthInsurancePlan,
  validateMarriageAfterDob,
  validateMedicarePartDDates,
  validateMedicarePlan,
  validateOHIDates,
  validateApplicantSsn,
  validateSponsorSsn,
  validateFutureDate,
} from '../../../helpers/validations';

describe('1010d `validateSponsorSsn` form validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  it('should not add an error when SSN is empty', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '', fullData);
    sinon.assert.notCalled(errors.addError);
  });

  it('should not add an error when SSN is undefined', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, undefined, fullData);
    sinon.assert.notCalled(errors.addError);
  });

  it('should add an error when SSN is invalid', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '123-45-678X', fullData);
    sinon.assert.calledOnce(errors.addError);
  });

  it('should add an error when SSN is too short', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '1231231', fullData);
    sinon.assert.calledOnce(errors.addError);
  });

  it('should not add an error when SSN is valid and unique', () => {
    const fullData = { applicants: [{ applicantSsn: '345345345' }] };
    validateSponsorSsn(errors, '123123123', fullData);
    sinon.assert.notCalled(errors.addError);
  });

  it('should add an error when SSN matches an applicant SSN', () => {
    const fullData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '345345345' },
      ],
    };
    validateSponsorSsn(errors, '123123123', fullData);
    sinon.assert.calledOnce(errors.addError);
  });

  it('should correctly handle SSNs with different formatting', () => {
    const fullData = { applicants: [{ applicantSsn: '123-12-3123' }] };
    validateSponsorSsn(errors, '123123123', fullData);
    sinon.assert.calledOnce(errors.addError);
  });

  it('should correctly handle empty applicants array', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '123123123', fullData);
    sinon.assert.notCalled(errors.addError);
  });

  it('should correctly handle missing applicants property', () => {
    const fullData = {};
    validateSponsorSsn(errors, '123123123', fullData);
    sinon.assert.notCalled(errors.addError);
  });
});

describe('1010d `validateApplicantSsn` form validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  context('when adding the first applicant', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/applicants/0', search: '?add=true' },
        writable: true,
      });
    });

    it('should not add an error when SSN is empty', () => {
      const fullData = { sponsorSsn: '345345345', applicants: [] };
      validateApplicantSsn(errors, '', fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should not add an error when SSN is undefined', () => {
      const fullData = { sponsorSsn: '345345345', applicants: [] };
      validateApplicantSsn(errors, undefined, fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should add an error when SSN is invalid', () => {
      const fullData = { sponsorSsn: '345345345', applicants: [] };
      validateApplicantSsn(errors, '211-11-111X', fullData);
      sinon.assert.calledOnce(errors.addError);
    });

    it('should add an error when SSN matches sponsor SSN', () => {
      const fullData = {
        sponsorSsn: '123123123',
        applicants: [],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.calledOnce(errors.addError);
    });

    it('should correctly handle SSNs with different formatting when comparing to sponsor', () => {
      const fullData = { sponsorSsn: '123-12-3123', applicants: [] };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.calledOnce(errors.addError);
    });
  });

  context('when working with multiple applicants', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/applicants/1', search: '?add=true' },
        writable: true,
      });
    });

    it('should not add an error when SSN is valid and unique', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [{ applicantSsn: '211-11-1111' }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should add an error when SSN matches another applicant SSN', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [{ applicantSsn: '123123123' }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.calledOnce(errors.addError);
    });

    it('should correctly handle missing sponsor SSN', () => {
      const fullData = {
        applicants: [{ applicantSsn: '211-11-1111' }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should handle applicants with undefined/missing SSNs', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [{ applicantSsn: undefined }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should not flag current applicant as duplicate of itself during edit', () => {
      // Simulate editing the first applicant (index 0)
      Object.defineProperty(window, 'location', {
        value: { pathname: '/applicants/0', search: '?edit=true' },
        writable: true,
      });

      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' }, // Current applicant being edited
          { applicantSsn: '211-11-1111' },
        ],
      };
      // Should not error when "changing" to the same SSN
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should detect duplicates when changing to existing SSN during edit', () => {
      // simulate editing the first applicant (index 0)
      Object.defineProperty(window, 'location', {
        value: { pathname: '/applicants/0', search: '?edit=true' },
        writable: true,
      });

      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211111111' },
        ],
      };
      validateApplicantSsn(errors, '211111111', fullData);
      sinon.assert.calledOnce(errors.addError);
    });
  });

  context('when on the review and submit page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/review-and-submit' },
        writable: true,
      });
    });

    it('should not add an error when applicant SSN is unique (only appears once)', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211211211' },
          { applicantSsn: '311311311' },
        ],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.notCalled(errors.addError);
    });

    it('should add an error when applicant SSN appears multiple times (duplicates exist)', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211211211' },
          { applicantSsn: '123123123' },
        ],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.calledOnce(errors.addError);
    });

    it('should add an error when applicant SSN matches sponsor SSN on review page', () => {
      const fullData = {
        sponsorSsn: '123123123',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211211211' },
        ],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.calledOnce(errors.addError);
    });

    it('should handle edge case with three identical SSNs on review page', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '123123123' },
          { applicantSsn: '123123123' },
        ],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      sinon.assert.calledOnce(errors.addError);
    });
  });
});

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

describe('1010d `validateMedicarePlan` form validation', () => {
  const NOW_ISO_DATE = '2025-11-05';
  const NOW_ISO = `${NOW_ISO_DATE}T12:00:00.000Z`;
  const DATES = {
    past: '2020-01-01',
    pastD: '2020-06-01',
    today: NOW_ISO_DATE,
    future: '2030-01-01',
  };

  const files = {
    valid: (name = 'test-file.pdf') => [{ name }],
    invalid: () => [],
  };
  const makeItem = (overrides = {}) => ({
    ...overrides,
  });
  let clock;

  before(() => {
    clock = sinon.useFakeTimers(new Date(NOW_ISO));
  });

  after(() => {
    clock.restore();
  });

  context('Basic validation', () => {
    it('should gracefully handle empty item object', () => {
      expect(validateMedicarePlan({})).to.be.true;
    });

    it('should gracefully handle `undefined` item', () => {
      expect(validateMedicarePlan(undefined)).to.be.true;
    });

    it('should return "true" when plan type is omitted', () => {
      expect(validateMedicarePlan(makeItem())).to.be.true;
    });
  });

  context('Medicare Part A validation', () => {
    const invalidCases = [
      {
        name: 'effective date is omitted',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {},
          medicarePartAFrontCard: files.valid(),
          medicarePartABackCard: files.valid(),
        }),
      },
      {
        name: 'effective date is in the future',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {
            medicarePartAEffectiveDate: DATES.future,
          },
          medicarePartAFrontCard: files.valid(),
          medicarePartABackCard: files.valid(),
        }),
      },
      {
        name: 'front of card upload is omitted',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {
            medicarePartAEffectiveDate: DATES.past,
          },
          medicarePartAFrontCard: files.invalid(),
          medicarePartABackCard: files.valid(),
        }),
      },
      {
        name: 'back of card upload is omitted',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {
            medicarePartAEffectiveDate: DATES.past,
          },
          medicarePartAFrontCard: files.valid(),
          medicarePartABackCard: files.invalid(),
        }),
      },
      {
        name: 'file array is empty',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {
            medicarePartAEffectiveDate: DATES.past,
          },
          medicarePartAFrontCard: [],
          medicarePartABackCard: files.valid(),
        }),
      },
      {
        name: 'file array has object without name',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {
            medicarePartAEffectiveDate: DATES.past,
          },
          medicarePartAFrontCard: [{}],
          medicarePartABackCard: files.valid(),
        }),
      },
      {
        name: 'file property is undefined',
        item: makeItem({
          medicarePlanType: 'a',
          'view:medicarePartAEffectiveDate': {
            medicarePartAEffectiveDate: DATES.past,
          },
          medicarePartAFrontCard: undefined,
          medicarePartABackCard: files.valid(),
        }),
      },
    ];

    for (const c of invalidCases) {
      it(`should return "true" when ${c.name}`, () => {
        expect(validateMedicarePlan(c.item)).to.be.true;
      });
    }

    it('should return "false" when effective date is valid + both cards uploaded', () => {
      const base = {
        medicarePlanType: 'a',
        'view:medicarePartAEffectiveDate': {
          medicarePartAEffectiveDate: DATES.past,
        },
        medicarePartAFrontCard: files.valid(),
        medicarePartABackCard: files.valid(),
      };
      expect(validateMedicarePlan(makeItem(base))).to.be.false;

      const today = {
        ...base,
        'view:medicarePartAEffectiveDate': {
          medicarePartAEffectiveDate: DATES.today,
        },
      };
      expect(validateMedicarePlan(today)).to.be.false;
    });
  });

  context('Medicare Part B validation', () => {
    it('should return "true" when missing card uploads', () => {
      const item = makeItem({
        medicarePlanType: 'b',
        'view:medicarePartBEffectiveDate': {
          medicarePartBEffectiveDate: DATES.past,
        },
        medicarePartBFrontCard: files.invalid(),
        medicarePartBBackCard: files.invalid(),
      });
      expect(validateMedicarePlan(item)).to.be.true;
    });

    it('should return "false" when effective date is valid + both cards uploaded', () => {
      const item = makeItem({
        medicarePlanType: 'b',
        'view:medicarePartBEffectiveDate': {
          medicarePartBEffectiveDate: DATES.past,
        },
        medicarePartBFrontCard: files.valid(),
        medicarePartBBackCard: files.valid(),
      });
      expect(validateMedicarePlan(item)).to.be.false;
    });
  });

  context('Medicare Parts A and B validation', () => {
    const base = {
      medicarePlanType: 'ab',
      'view:medicarePartAEffectiveDate': {
        medicarePartAEffectiveDate: DATES.past,
      },
      'view:medicarePartBEffectiveDate': {
        medicarePartBEffectiveDate: DATES.past,
      },
    };

    for (const [name, front, back] of [
      ['combined front card is omitted', files.invalid(), files.valid()],
      ['combined back card is omitted', files.valid(), files.invalid()],
    ]) {
      it(`should return "true" when ${name}`, () => {
        const item = makeItem({
          ...base,
          medicarePartAPartBFrontCard: front,
          medicarePartAPartBBackCard: back,
        });
        expect(validateMedicarePlan(item)).to.be.true;
      });
    }

    it('should return "false" when effective date is valid + both cards uploaded', () => {
      const item = makeItem({
        ...base,
        medicarePartAPartBFrontCard: files.valid(),
        medicarePartAPartBBackCard: files.valid(),
      });
      expect(validateMedicarePlan(item)).to.be.false;
    });
  });

  context('Medicare Part C validation', () => {
    const base = {
      medicarePlanType: 'c',
      medicarePartCCarrier: 'Cigna',
      medicarePartCEffectiveDate: DATES.past,
    };

    for (const [name, front, back] of [
      ['front card is omitted', files.invalid(), files.valid()],
      ['back card is omitted', files.valid(), files.invalid()],
    ]) {
      it(`should return "true" when ${name}`, () => {
        const item = makeItem({
          ...base,
          medicarePartCFrontCard: front,
          medicarePartCBackCard: back,
        });
        expect(validateMedicarePlan(item)).to.be.true;
      });
    }

    it('should return "false" when effective date is valid + both cards uploaded', () => {
      const item = makeItem({
        ...base,
        medicarePartCFrontCard: files.valid(),
        medicarePartCBackCard: files.valid(),
      });
      expect(validateMedicarePlan(item)).to.be.false;
    });
  });

  context('Medicare Part D validation with card uploads', () => {
    const baseAB = {
      medicarePlanType: 'ab',
      'view:medicarePartAEffectiveDate': {
        medicarePartAEffectiveDate: DATES.past,
      },
      'view:medicarePartBEffectiveDate': {
        medicarePartBEffectiveDate: DATES.past,
      },
      medicarePartAPartBFrontCard: files.valid(),
      medicarePartAPartBBackCard: files.valid(),
    };
    const baseC = {
      medicarePlanType: 'c',
      medicarePartCCarrier: 'Cigna',
      medicarePartCEffectiveDate: DATES.past,
      medicarePartCFrontCard: files.valid(),
      medicarePartCBackCard: files.valid(),
    };

    for (const [name, mutation] of [
      [
        'Part D is enabled with front card omitted',
        {
          hasMedicarePartD: true,
          medicarePartDEffectiveDate: DATES.pastD,
          medicarePartDFrontCard: files.invalid(),
          medicarePartDBackCard: files.valid(),
        },
      ],
      [
        'Part D is enabled with back card omitted',
        {
          hasMedicarePartD: true,
          medicarePartDEffectiveDate: DATES.pastD,
          medicarePartDFrontCard: files.valid(),
          medicarePartDBackCard: files.invalid(),
        },
      ],
      [
        'Part D is enabled with future effective date',
        {
          hasMedicarePartD: true,
          medicarePartDEffectiveDate: DATES.future,
          medicarePartDFrontCard: files.valid(),
          medicarePartDBackCard: files.valid(),
        },
      ],
      [
        'Part D is enabled with future termination date',
        {
          hasMedicarePartD: true,
          medicarePartDEffectiveDate: DATES.pastD,
          medicarePartDTerminationDate: DATES.future,
          medicarePartDFrontCard: files.valid(),
          medicarePartDBackCard: files.valid(),
        },
      ],
    ]) {
      it(`should return "true" when ${name}`, () => {
        const item = makeItem({ ...baseAB, ...mutation });
        expect(validateMedicarePlan(item)).to.be.true;
      });
    }

    it('should return "false" with valid Parts A, B & D effective dates + cards uploaded', () => {
      const item = makeItem({
        ...baseAB,
        hasMedicarePartD: true,
        medicarePartDEffectiveDate: DATES.pastD,
        medicarePartDFrontCard: files.valid(),
        medicarePartDBackCard: files.valid(),
      });
      expect(validateMedicarePlan(item)).to.be.false;
    });

    it('should return "false" with valid Parts C & D effective dates + cards uploaded', () => {
      const item = makeItem({
        ...baseC,
        hasMedicarePartD: true,
        medicarePartDEffectiveDate: DATES.pastD,
        medicarePartDFrontCard: files.valid(),
        medicarePartDBackCard: files.valid(),
      });
      expect(validateMedicarePlan(item)).to.be.false;
    });

    it('should return "false" with valid Parts A & B + no required Part D', () => {
      const item = makeItem({
        ...baseAB,
        hasMedicarePartD: false,
      });
      expect(validateMedicarePlan(item)).to.be.false;
    });
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

describe('1010d `validateApplicant` form validation', () => {
  const dateStr = (y, m = 1, d = 1) =>
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const files = (...names) => names.map(n => (n ? { name: n } : {}));
  const makeApplicant = (overrides = {}) => ({
    applicantName: { first: 'John', last: 'Doe' },
    applicantDob: '1990-01-01',
    applicantSsn: '123456789',
    applicantGender: { gender: 'M' },
    applicantPhone: '555-123-4567',
    applicantAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'NY',
      postalCode: '12345',
    },
    applicantRelationshipToSponsor: { relationshipToVeteran: 'spouse' },
    ...overrides,
  });
  const NOW = new Date('2025-01-15T12:00:00Z');
  const withAge = years => dateStr(NOW.getUTCFullYear() - years);
  let clock;

  before(() => {
    clock = sinon.useFakeTimers({ now: +NOW, toFake: ['Date'] });
  });

  after(() => {
    clock.restore();
  });

  context('Basic required fields validation', () => {
    it('should return "false" for a complete, valid spouse applicant', () => {
      const applicant = makeApplicant({
        dateOfMarriageToSponsor: '2015-06-15',
      });
      expect(validateApplicant(applicant)).to.be.false;
    });

    [
      ['first name is omitted', { applicantName: { last: 'Doe' } }],
      ['last name is omitted', { applicantName: { first: 'John' } }],
      ['DOB is omitted', { applicantDob: undefined }],
      ['SSN is omitted', { applicantSsn: undefined }],
      ['gender is omitted', { applicantGender: {} }],
      ['phone is omitted', { applicantPhone: undefined }],
      [
        'street is omitted',
        { applicantAddress: { city: 'Anytown', state: 'NY' } },
      ],
      [
        'city is omitted',
        { applicantAddress: { street: '123 Main St', state: 'NY' } },
      ],
      [
        'state is omitted',
        { applicantAddress: { street: '123 Main St', city: 'Anytown' } },
      ],
      [
        'relationship to sponsor is omitted',
        { applicantRelationshipToSponsor: {} },
      ],
      ['applicant name is undefined', { applicantName: undefined }],
      ['applicant address is undefined', { applicantAddress: undefined }],
      [
        'relationship to sponsor is undefined',
        { applicantRelationshipToSponsor: undefined },
      ],
    ].forEach(([label, overrides]) => {
      it(`should return "true" when ${label}`, () => {
        const applicant = makeApplicant(overrides);
        expect(validateApplicant(applicant)).to.be.true;
      });
    });
  });

  context('Date validation', () => {
    it('should return "true" for invalid DOB', () => {
      const applicant = makeApplicant({ applicantDob: 'invalid-date' });
      expect(validateApplicant(applicant)).to.be.true;
    });

    it('should return "true" for future DOB', () => {
      const future = dateStr(NOW.getUTCFullYear() + 1, 1, 1);
      const applicant = makeApplicant({ applicantDob: future });
      expect(validateApplicant(applicant)).to.be.true;
    });

    it('should return "false" for valid past DOB', () => {
      const applicant = makeApplicant({
        dateOfMarriageToSponsor: '2015-06-15',
      });
      expect(validateApplicant(applicant)).to.be.false;
    });
  });

  context('Spouse validation', () => {
    const spouse = (overrides = {}) =>
      makeApplicant({
        applicantRelationshipToSponsor: { relationshipToVeteran: 'spouse' },
        ...overrides,
      });

    [
      ['marriage date is omitted', {}],
      ['marriage date is invalid', { dateOfMarriageToSponsor: 'invalid-date' }],
      [
        'marriage date is a future date',
        { dateOfMarriageToSponsor: dateStr(NOW.getUTCFullYear() + 1) },
      ],
      [
        'marriage date is before DOB',
        { applicantDob: '1990-01-01', dateOfMarriageToSponsor: '1989-12-31' },
      ],
    ].forEach(([label, overrides]) => {
      it(`should return "true" when ${label}`, () => {
        expect(validateApplicant(spouse(overrides))).to.be.true;
      });
    });

    it('should return "false" for valid spouse with proper marriage date', () => {
      expect(
        validateApplicant(spouse({ dateOfMarriageToSponsor: '2015-06-15' })),
      ).to.be.false;
    });
  });

  context('Child validation', () => {
    const child = (overrides = {}) =>
      makeApplicant({
        applicantRelationshipToSponsor: { relationshipToVeteran: 'child' },
        ...overrides,
      });

    it('should return "true" when relationship origin is omitted', () => {
      expect(validateApplicant(child())).to.be.true;
    });

    context('Biological child', () => {
      it('should return "false" for valid biological child', () => {
        expect(
          validateApplicant(
            child({
              applicantRelationshipOrigin: { relationshipToVeteran: 'blood' },
            }),
          ),
        ).to.be.false;
      });
    });

    context('Adopted child', () => {
      const adopted = (overrides = {}) =>
        child({
          applicantRelationshipOrigin: { relationshipToVeteran: 'adoption' },
          ...overrides,
        });

      [
        ['birth certificate is omitted', {}],
        [
          'birth certificate array is empty',
          { applicantBirthCertOrSocialSecCard: [] },
        ],
        [
          'birth certificate is a nameless file',
          { applicantBirthCertOrSocialSecCard: files(null) },
        ],
      ].forEach(([label, overrides]) => {
        it(`should return "true" for adopted child when ${label}`, () => {
          expect(validateApplicant(adopted(overrides))).to.be.true;
        });
      });

      [
        [
          'adoption papers',
          { applicantBirthCertOrSocialSecCard: files('birth-cert.pdf') },
        ],
        [
          'empty adoption papers',
          {
            applicantBirthCertOrSocialSecCard: files('birth-cert.pdf'),
            applicantAdoptionPapers: [],
          },
        ],
        [
          'adoption paper has no name',
          {
            applicantBirthCertOrSocialSecCard: files('birth-cert.pdf'),
            applicantAdoptionPapers: files(null),
          },
        ],
      ].forEach(([label, overrides]) => {
        it(`should return "true" for adopted child when ${label}`, () => {
          expect(validateApplicant(adopted(overrides))).to.be.true;
        });
      });

      it('should return "false" for valid adopted child with all documents', () => {
        expect(
          validateApplicant(
            adopted({
              applicantBirthCertOrSocialSecCard: files('birth-cert.pdf'),
              applicantAdoptionPapers: files('adoption-papers.pdf'),
            }),
          ),
        ).to.be.false;
      });
    });

    context('Stepchild', () => {
      const step = (overrides = {}) =>
        child({
          applicantRelationshipOrigin: { relationshipToVeteran: 'step' },
          ...overrides,
        });

      it('should return "true" if birth certificate is omitted', () => {
        expect(validateApplicant(step())).to.be.true;
      });

      [
        [
          'proof of marriage is omitted',
          { applicantBirthCertOrSocialSecCard: files('birth-cert.pdf') },
        ],
        [
          'proof of marriage array is empty',
          {
            applicantBirthCertOrSocialSecCard: files('birth-cert.pdf'),
            applicantStepMarriageCert: [],
          },
        ],
        [
          'proof of marriage is a nameless file',
          {
            applicantBirthCertOrSocialSecCard: files('birth-cert.pdf'),
            applicantStepMarriageCert: files(null),
          },
        ],
      ].forEach(([label, overrides]) => {
        it(`should return "true" when ${label}`, () => {
          expect(validateApplicant(step(overrides))).to.be.true;
        });
      });

      it('should return "false" for valid stepchild', () => {
        expect(
          validateApplicant(
            step({
              applicantBirthCertOrSocialSecCard: files('birth-cert.pdf'),
              applicantStepMarriageCert: files('step-marriage-cert.pdf'),
            }),
          ),
        ).to.be.false;
      });
    });

    context('College-age dependent status', () => {
      const blood = {
        applicantRelationshipOrigin: { relationshipToVeteran: 'blood' },
      };
      const twentyYearOld = child({ ...blood, applicantDob: withAge(20) });

      it('should return "true" when dependent status is (age 20)', () => {
        expect(validateApplicant(twentyYearOld)).to.be.true;
      });

      it('should return "false" for over18HelplessChild (no school docs required)', () => {
        expect(
          validateApplicant({
            ...twentyYearOld,
            applicantDependentStatus: { status: 'over18HelplessChild' },
          }),
        ).to.be.false;
      });

      [
        [
          'enrolled dependent with no proof',
          { applicantDependentStatus: { status: 'enrolled' } },
        ],
        [
          'enrolled dependent with empty proof',
          {
            applicantDependentStatus: { status: 'enrolled' },
            applicantSchoolCert: [],
          },
        ],
        [
          'enrolled dependent with nameless file',
          {
            applicantDependentStatus: { status: 'enrolled' },
            applicantSchoolCert: files(null),
          },
        ],
      ].forEach(([label, overrides]) => {
        it(`should return "true" for ${label}`, () => {
          expect(validateApplicant({ ...twentyYearOld, ...overrides })).to.be
            .true;
        });
      });

      it('should return "false" for enrolled dependent with proof', () => {
        expect(
          validateApplicant({
            ...twentyYearOld,
            applicantDependentStatus: { status: 'enrolled' },
            applicantSchoolCert: files('school-enrollment.pdf'),
          }),
        ).to.be.false;
      });

      it('should return "true" for intendsToEnroll with no proof', () => {
        expect(
          validateApplicant({
            ...twentyYearOld,
            applicantDependentStatus: { status: 'intendsToEnroll' },
          }),
        ).to.be.true;
      });

      it('should return "false" for intendsToEnroll with proof', () => {
        expect(
          validateApplicant({
            ...twentyYearOld,
            applicantDependentStatus: { status: 'intendsToEnroll' },
            applicantSchoolCert: files('school-enrollment.pdf'),
          }),
        ).to.be.false;
      });
    });

    context('No dependent status required under 18 or over 23', () => {
      const blood = {
        applicantRelationshipOrigin: { relationshipToVeteran: 'blood' },
      };

      [
        ['16-year-old', withAge(16)],
        ['25-year-old', withAge(25)],
        [
          '17-year-old exact birthday',
          dateStr(
            NOW.getUTCFullYear() - 17,
            NOW.getUTCMonth() + 1,
            NOW.getUTCDate(),
          ),
        ],
        [
          '24-year-old exact birthday',
          dateStr(
            NOW.getUTCFullYear() - 24,
            NOW.getUTCMonth() + 1,
            NOW.getUTCDate(),
          ),
        ],
      ].forEach(([label, dob]) => {
        it(`should return "false" for ${label} with no dependent status`, () => {
          expect(validateApplicant(child({ ...blood, applicantDob: dob }))).to
            .be.false;
        });
      });
    });
  });

  context('Edge cases', () => {
    [
      ['empty object', {}],
      ['undefined', undefined],
      ['partial data (only first name)', { applicantName: { first: 'John' } }],
    ].forEach(([label, value]) => {
      it(`should return "true" for ${label}`, () => {
        expect(validateApplicant(value)).to.be.true;
      });
    });

    it('should return "false" for non-standard relationship types (treated as no extra reqs)', () => {
      const applicant = makeApplicant({
        applicantRelationshipToSponsor: { relationshipToVeteran: 'other' },
        dateOfMarriageToSponsor: '2015-06-15',
      });
      expect(validateApplicant(applicant)).to.be.false;
    });
  });
});

describe('1010d `validateFutureDate` form validation', () => {
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
