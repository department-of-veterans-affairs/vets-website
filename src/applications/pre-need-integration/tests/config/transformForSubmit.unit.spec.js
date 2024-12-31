import { expect } from 'chai';
import transformForSubmit from '../../config/transformForSubmit';

describe('transformForSubmit in Pre-need Integration', () => {
  let mockFormConfig;
  let mockForm;

  beforeEach(() => {
    mockFormConfig = {
      formId: 'test-form-id',
    };
    mockForm = {
      data: {
        application: {
          applicant: {
            applicantRelationshipToClaimant: 'Self',
            name: 'John Doe',
            mailingAddress: '123 Test Street',
          },
        },
      },
    };
  });

  it('should run without crashing and produce valid output', () => {
    const result = transformForSubmit(mockFormConfig, mockForm);

    expect(result).to.be.a('string');
    const parsedResult = JSON.parse(result);
    expect(parsedResult).to.have.property('formNumber', 'test-form-id');
    expect(parsedResult).to.have.property('version', 'int');

    expect(parsedResult.application.applicant).to.not.have.property('name');
    expect(parsedResult.application.applicant).to.not.have.property(
      'mailingAddress',
    );
  });
});
