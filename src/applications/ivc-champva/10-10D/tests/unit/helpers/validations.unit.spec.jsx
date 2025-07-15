import { expect } from 'chai';
import sinon from 'sinon';
import {
  fieldsMustMatchValidation,
  noDash,
  validateApplicantSsnIsUnique,
  validateSponsorSsnIsUnique,
} from '../../../helpers/validations';
import {
  certifierAddressCleanValidation,
  applicantAddressCleanValidation,
  validFieldCharsOnly,
  validObjectCharsOnly,
} from '../../../../shared/validations';

const REVIEW_PATH =
  'http://localhost:3001/family-and-caregiver-benefits/health-and-disability/champva/apply-form-10-10d/review-and-submit';

function stubWindowLocation(url) {
  const originalLocation = window.location;

  // Use defineProperty instead of direct assignment
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: url },
  });

  return () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  };
}

describe('fieldsMustMatchValidation helper', () => {
  let errorMessage = [];

  const errors = {
    addError: message => {
      errorMessage.push(message || '');
    },
  };

  beforeEach(() => {
    errorMessage = [];
  });

  it('should add error message when certifierPhone does not match applicantPhone', () => {
    // Set window.location.href to be review-and-submit since this validation
    // only fires on review page:
    const restoreLocation = stubWindowLocation(REVIEW_PATH);

    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: { certifierPhone: '' },
      formData: {
        certifierRole: 'applicant',
        applicants: [{ applicantPhone: '1231231234' }],
        sponsorPhone: '',
      },
    };

    fieldsMustMatchValidation(
      {
        certifierPhone: errors,
      },
      props.page,
      props.formData,
      'certifierPhone',
      'applicantPhone',
      'sponsorPhone',
    );
    expect(errorMessage.length > 0).to.be.true;

    // Restore original href
    restoreLocation();
  });

  it('should add error message when certifierName does not match veteransFullName', () => {
    // Set window.location.href to be review-and-submit since this validation
    // only fires on review page:
    const hrefBeforeMock = stubWindowLocation(REVIEW_PATH);
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: { certifierName: { first: '', last: '' } },
      formData: {
        certifierRole: 'sponsor',
        applicants: [{ applicantName: { first: '', last: '' } }],
        veteransFullName: { first: 'x', last: 'y' },
      },
    };

    fieldsMustMatchValidation(
      {
        certifierName: { first: errors, last: errors },
      },
      props.page,
      props.formData,
      'certifierName',
      'applicantName',
      'veteransFullName',
    );
    expect(errorMessage.length > 0).to.be.true;

    // Restore original href
    window.location = { href: hrefBeforeMock };
  });

  it('should NOT add error message when certifierName does not match veteransFullName BUT we are not on review page', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: { certifierName: { first: '', last: '' } },
      formData: {
        certifierRole: 'sponsor',
        applicants: [{ applicantName: { first: '', last: '' } }],
        veteransFullName: { first: 'x', last: 'y' },
      },
    };

    // Because we are not on a review-and-submit page, this should
    // not update the error message despite having a mismatch.
    fieldsMustMatchValidation(
      {
        certifierName: { first: errors, last: errors },
      },
      props.page,
      props.formData,
      'certifierName',
      'applicantName',
      'veteransFullName',
    );
    expect(errorMessage.length > 0).to.be.false;
  });
});

describe('validAddressCharsOnly validator', () => {
  let errorMessage = [];
  const addError = message => {
    errorMessage.push(message || '');
  };
  const addressErrors = {
    country: { addError },
    street: { addError },
    street2: { addError },
    city: { addError },
    state: { addError },
    postalCode: { addError },
  };
  const validAddress = {
    country: 'USA',
    street: 'st 1',
    street2: 'St 2',
    city: 'Phoenix',
    state: 'AZ',
    postalCode: '12345',
  };
  const invalidAddress = {
    ...validAddress,
    street2: '"@%',
  };

  beforeEach(() => {
    errorMessage = [];
  });

  /*
  `certifierAddress` and `applicantAddress` reflect address objects
  that are outside and inside the list loop respectively. Not
  explicitly testing `sponsorAddressCleanValidation` as it 
  functions identically to `certifierAddressCleanValidation`.
  */
  it('should add errors to certifier address fields containing illegal characters', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: {},
      formData: {
        certifierAddress: {
          ...invalidAddress,
        },
      },
    };

    certifierAddressCleanValidation(
      {
        certifierAddress: addressErrors,
      },
      props.page,
      props.formData,
    );
    expect(errorMessage.length > 0).to.be.true;
  });

  it('should NOT add errors to certifier address fields if all characters are valid', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: {},
      formData: {
        certifierAddress: {
          ...validAddress,
        },
      },
    };

    certifierAddressCleanValidation(
      {
        certifierAddress: addressErrors,
      },
      props.page,
      props.formData,
    );
    expect(errorMessage.length === 0).to.be.true;
  });

  it('should add errors to applicant address fields containing illegal characters', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: invalidAddress,
      // formData is a single list loop item
      formData: {
        applicantAddress: invalidAddress,
      },
    };

    applicantAddressCleanValidation(addressErrors, props.page, props.formData);
    expect(errorMessage.length > 0).to.be.true;
  });

  it('should NOT add errors to applicant address fields if all characters are valid', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: validAddress,
      // formData is a single list loop item
      formData: {
        applicantAddress: validAddress,
      },
    };

    applicantAddressCleanValidation(addressErrors, props.page, props.formData);
    expect(errorMessage.length === 0).to.be.true;
  });
});

describe('validFieldCharsOnly validator', () => {
  let errorMessage = [];
  const addError = message => {
    errorMessage.push(message || '');
  };

  beforeEach(() => {
    errorMessage = [];
  });

  it('should add errors to text fields containing illegal chars', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      formData: {
        someTextField: 'invalid"@%',
      },
    };

    validFieldCharsOnly(
      { someTextField: { addError } },
      null,
      props.formData,
      'someTextField',
    );

    expect(errorMessage.length > 0).to.be.true;
  });

  it('should not add errors to valid text fields', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      formData: {
        someTextField: 'this is valid text',
      },
    };

    validFieldCharsOnly(
      { someTextField: { addError } },
      null,
      props.formData,
      'someTextField',
    );

    expect(errorMessage.length === 0).to.be.true;
  });
});

describe('validObjectCharsOnly validator', () => {
  let errorMessage = [];
  const addError = message => {
    errorMessage.push(message || '');
  };
  const fullNameErrors = {
    first: { addError },
    middle: { addError },
    last: { addError },
    suffix: { addError },
  };
  const validFullName = {
    first: 'Jim',
    middle: 'L',
    last: 'Smith',
    suffix: 'Jr.',
  };
  const invalidFullName = {
    ...validFullName,
    last: '"@%',
  };

  beforeEach(() => {
    errorMessage = [];
  });

  it('should add errors to full name fields containing illegal characters', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: {},
      formData: {
        veteranFullName: {
          ...invalidFullName,
        },
      },
    };

    validObjectCharsOnly(
      { veteranFullName: fullNameErrors },
      null,
      props.formData,
      'veteranFullName',
    );

    expect(errorMessage.length > 0).to.be.true;
  });

  it('should not add errors to valid full name fields', () => {
    expect(errorMessage[0]).to.be.undefined;

    const props = {
      page: {},
      formData: {
        veteranFullName: {
          ...validFullName,
        },
      },
    };

    validObjectCharsOnly(
      { veteranFullName: fullNameErrors },
      null,
      props.formData,
      'veteranFullName',
    );

    expect(errorMessage.length === 0).to.be.true;
  });
});

describe('SSN validation helpers', () => {
  describe('noDash', () => {
    it('should remove dashes from a string', () => {
      expect(noDash('123-45-6789')).to.equal('123456789');
    });

    it('should handle strings without dashes', () => {
      expect(noDash('123456789')).to.equal('123456789');
    });

    it('should handle null or undefined inputs', () => {
      expect(noDash(null)).to.equal(undefined);
      expect(noDash(undefined)).to.equal(undefined);
    });
  });

  describe('validateSponsorSsnIsUnique', () => {
    let errors;

    beforeEach(() => {
      errors = {
        ssn: {
          addError: sinon.spy(),
        },
      };
    });

    it('should add an error when applicant SSN matches sponsor SSN', () => {
      const page = {
        ssn: '123-45-6789',
        applicants: [
          { applicantSSN: '123456789' },
          { applicantSSN: '987-65-4321' },
        ],
      };

      validateSponsorSsnIsUnique(errors, page);
      expect(errors.ssn.addError.calledOnce).to.be.true;
      expect(
        errors.ssn.addError.calledWith(
          'This Social Security number is in use elsewhere in the form. SSNs must be unique.',
        ),
      ).to.be.true;
    });

    it('should not add an error when all SSNs are unique', () => {
      const page = {
        ssn: '123-45-6789',
        applicants: [
          { applicantSSN: '234-56-7890' },
          { applicantSSN: '987-65-4321' },
        ],
      };

      validateSponsorSsnIsUnique(errors, page);
      expect(errors.ssn.addError.called).to.be.false;
    });

    it('should handle empty applicants array', () => {
      const page = {
        ssn: '123-45-6789',
        applicants: [],
      };

      validateSponsorSsnIsUnique(errors, page);
      expect(errors.ssn.addError.called).to.be.false;
    });
  });

  describe('validateApplicantSsnIsUnique', () => {
    let errors;

    beforeEach(() => {
      errors = {
        applicantSSN: {
          addError: sinon.spy(),
        },
      };
    });

    it('should add an error when applicant SSN matches sponsor SSN', () => {
      const page = {
        applicantSSN: '123-45-6789',
        'view:sponsorSSN': '123456789',
        'view:pagePerItemIndex': 0,
        'view:applicantSSNArray': ['123-45-6789', '987-65-4321'],
      };

      validateApplicantSsnIsUnique(errors, page);
      expect(errors.applicantSSN.addError.calledOnce).to.be.true;
    });

    it('should add an error when applicant SSN matches another applicant SSN', () => {
      const page = {
        applicantSSN: '987-65-4321',
        'view:sponsorSSN': '123-45-6789',
        'view:pagePerItemIndex': 0,
        'view:applicantSSNArray': ['987-65-4321', '987654321'],
      };

      validateApplicantSsnIsUnique(errors, page);
      expect(errors.applicantSSN.addError.calledOnce).to.be.true;
    });

    it('should not add an error when all SSNs are unique', () => {
      const page = {
        applicantSSN: '987-65-4321',
        'view:sponsorSSN': '123-45-6789',
        'view:pagePerItemIndex': 0,
        'view:applicantSSNArray': ['987-65-4321', '234-56-7890'],
      };

      validateApplicantSsnIsUnique(errors, page);
      expect(errors.applicantSSN.addError.called).to.be.false;
    });

    it('should ignore the current applicant when checking for duplicates', () => {
      const page = {
        applicantSSN: '987-65-4321',
        'view:sponsorSSN': '123-45-6789',
        'view:pagePerItemIndex': 0,
        'view:applicantSSNArray': ['987-65-4321', '234-56-7890'],
      };

      validateApplicantSsnIsUnique(errors, page);
      expect(errors.applicantSSN.addError.called).to.be.false;
    });

    it('should return undefined when `view:pagePerItemIndex` is undefined', () => {
      const page = {
        applicantSSN: '987-65-4321',
        'view:sponsorSSN': '123-45-6789',
        'view:applicantSSNArray': ['987-65-4321', '234-56-7890'],
      };

      const res = validateApplicantSsnIsUnique(errors, page);
      expect(errors.applicantSSN.addError.called).to.be.false;
      expect(res).to.be.undefined;
    });

    it('should return undefined when `view:applicantSSNArray` is undefined', () => {
      const page = {
        applicantSSN: '987-65-4321',
        'view:sponsorSSN': '123-45-6789',
        'view:applicantSSNArray': ['987-65-4321', '234-56-7890'],
      };

      const res = validateApplicantSsnIsUnique(errors, page);
      expect(errors.applicantSSN.addError.called).to.be.false;
      expect(res).to.be.undefined;
    });
  });
});
