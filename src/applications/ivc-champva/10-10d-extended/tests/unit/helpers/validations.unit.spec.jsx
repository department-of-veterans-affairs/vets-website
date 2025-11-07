import sinon from 'sinon-v20';
import { expect } from 'chai';
import {
  validateApplicant,
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

describe('1010d `validateApplicant` form validation', () => {
  const dateStr = (y, m = 1, d = 1) =>
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const files = (...names) => names.map(n => (n ? { name: n } : {}));
  const makeApplicant = (overrides = {}) => ({
    applicantName: { first: 'John', last: 'Doe' },
    applicantDob: '1990-01-01',
    applicantSSN: '123456789',
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
      ['SSN is omitted', { applicantSSN: undefined }],
      ['gender is omitted', { applicantGender: {} }],
      ['phone is omitted', { applicantPhone: undefined }],
      [
        'streetis omitted',
        { applicantAddress: { city: 'Anytown', state: 'NY' } },
      ],
      [
        'cityis omitted',
        { applicantAddress: { street: '123 Main St', state: 'NY' } },
      ],
      [
        'stateis omitted',
        { applicantAddress: { street: '123 Main St', city: 'Anytown' } },
      ],
      [
        'relationship to sponsoris omitted',
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
