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
            name: 'Sonic Hedgehog',
            mailingAddress: '123 GreenHillZone Street',
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

  it('should retain name and mailingAddress if applicantRelationshipToClaimant is not Self', () => {
    mockForm.data.application.applicant.applicantRelationshipToClaimant =
      'Other';
    const result = transformForSubmit(mockFormConfig, mockForm);

    expect(result).to.be.a('string');
    const parsedResult = JSON.parse(result);
    expect(parsedResult).to.have.property('formNumber', 'test-form-id');
    expect(parsedResult).to.have.property('version', 'int');

    expect(parsedResult.application.applicant).to.have.property(
      'name',
      'Sonic Hedgehog',
    );
    expect(parsedResult.application.applicant).to.have.property(
      'mailingAddress',
      '123 GreenHillZone Street',
    );
  });
});
