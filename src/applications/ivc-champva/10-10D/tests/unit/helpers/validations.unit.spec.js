import { expect } from 'chai';
import { fieldsMustMatchValidation } from '../../../helpers/validations';

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
  });

  it('should add error message when certifierName does not match veteransFullName', () => {
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
  });
});
