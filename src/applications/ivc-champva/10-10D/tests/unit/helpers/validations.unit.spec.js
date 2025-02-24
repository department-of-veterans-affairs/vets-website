import { expect } from 'chai';
import {
  fieldsMustMatchValidation,
  certifierAddressCleanValidation,
  applicantAddressCleanValidation,
} from '../../../helpers/validations';

const REVIEW_PATH =
  'http://localhost:3001/family-and-caregiver-benefits/health-and-disability/champva/apply-form-10-10d/review-and-submit';

function stubWindowLocation(url) {
  const originalHref = window.location.href;
  delete window.location;
  window.location = { href: url };
  return originalHref;
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
    const hrefBeforeMock = stubWindowLocation(REVIEW_PATH);

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
    window.location = { href: hrefBeforeMock };
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
