import sinon from 'sinon-v20';
import { expect } from 'chai';
import {
  validateMarriageAfterDob,
  validateMedicarePartDDates,
  validateMedicarePlan,
  validateOHIDates,
  validateApplicantSsn,
  validateSponsorSsn,
} from '../../../helpers/validations';

describe('1010d `validateSponsorSsn` form validation', () => {
  let errors;

  beforeEach(() => {
    errors = { addError: sinon.spy() };
  });

  it('should not add an error when SSN is empty', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '', fullData);
    expect(errors.addError.called).to.be.false;
  });

  it('should not add an error when SSN is undefined', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, undefined, fullData);
    expect(errors.addError.called).to.be.false;
  });

  it('should add an error when SSN is invalid', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '123-45-678X', fullData);
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('should add an error when SSN is too short', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '1231231', fullData);
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('should not add an error when SSN is valid and unique', () => {
    const fullData = { applicants: [{ applicantSsn: '345345345' }] };
    validateSponsorSsn(errors, '123123123', fullData);
    expect(errors.addError.called).to.be.false;
  });

  it('should add an error when SSN matches an applicant SSN', () => {
    const fullData = {
      applicants: [
        { applicantSsn: '123123123' },
        { applicantSsn: '345345345' },
      ],
    };
    validateSponsorSsn(errors, '123123123', fullData);
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('should correctly handle SSNs with different formatting', () => {
    const fullData = { applicants: [{ applicantSsn: '123-12-3123' }] };
    validateSponsorSsn(errors, '123123123', fullData);
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('should correctly handle empty applicants array', () => {
    const fullData = { applicants: [] };
    validateSponsorSsn(errors, '123123123', fullData);
    expect(errors.addError.called).to.be.false;
  });

  it('should correctly handle missing applicants property', () => {
    const fullData = {};
    validateSponsorSsn(errors, '123123123', fullData);
    expect(errors.addError.called).to.be.false;
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
      expect(errors.addError.called).to.be.false;
    });

    it('should not add an error when SSN is undefined', () => {
      const fullData = { sponsorSsn: '345345345', applicants: [] };
      validateApplicantSsn(errors, undefined, fullData);
      expect(errors.addError.called).to.be.false;
    });

    it('should add an error when SSN is invalid', () => {
      const fullData = { sponsorSsn: '345345345', applicants: [] };
      validateApplicantSsn(errors, '211-11-111X', fullData);
      expect(errors.addError.calledOnce).to.be.true;
    });

    it('should add an error when SSN matches sponsor SSN', () => {
      const fullData = {
        sponsorSsn: '123123123',
        applicants: [],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      expect(errors.addError.calledOnce).to.be.true;
    });

    it('should correctly handle SSNs with different formatting when comparing to sponsor', () => {
      const fullData = {
        sponsorSsn: '123-12-3123',
        applicants: [],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      expect(errors.addError.calledOnce).to.be.true;
    });
  });

  context('when adding additional applicants', () => {
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
      expect(errors.addError.called).to.be.false;
    });

    it('should add an error when SSN matches another applicant SSN', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [{ applicantSsn: '123123123' }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      expect(errors.addError.calledOnce).to.be.true;
    });

    it('should correctly handle missing sponsor SSN', () => {
      const fullData = {
        applicants: [{ applicantSsn: '211-11-1111' }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      expect(errors.addError.called).to.be.false;
    });

    it('should handle applicants with undefined/missing SSNs', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [{ applicantSsn: undefined }],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      expect(errors.addError.called).to.be.false;
    });
  });

  context('when editing an applicant', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/applicants/0', search: '?edit=true' },
        writable: true,
      });
    });

    it('should not add an error when editing and keeping the same SSN', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211-11-1111' },
        ],
      };
      validateApplicantSsn(errors, '123123123', fullData);
      expect(errors.addError.called).to.be.false;
    });

    it('should add an error when editing and changing to a duplicate SSN', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211111111' },
        ],
      };
      validateApplicantSsn(errors, '211111111', fullData);
      expect(errors.addError.calledOnce).to.be.true;
    });

    it('should not add an error when editing and changing to a unique SSN', () => {
      const fullData = {
        sponsorSsn: '345345345',
        applicants: [
          { applicantSsn: '123123123' },
          { applicantSsn: '211111111' },
        ],
      };
      validateApplicantSsn(errors, '311111111', fullData);
      expect(errors.addError.called).to.be.false;
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
