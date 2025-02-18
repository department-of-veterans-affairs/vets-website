import { expect } from 'chai';
import { fieldsMustMatchValidation } from '../../../helpers/validations';

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
