import { expect } from 'chai';
import {
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import additionalEvidence, {
  requiresAdditionalEvidence,
} from '../../../../config/chapters/03-health-and-employment-information/additionalEvidence';

const { schema, uiSchema } = additionalEvidence;

describe('pension medical evidence', () => {
  const pageTitle = 'Additional Evidence';
  const expectedNumberOfFields = 0;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  it('depends on medical evidence being required', () => {
    expect(
      requiresAdditionalEvidence({
        socialSecurityDisability: false,
        medicalCondition: false,
      }),
    ).to.be.false;
    expect(requiresAdditionalEvidence({ socialSecurityDisability: true })).to.be
      .true;
    expect(requiresAdditionalEvidence({ medicalCondition: true })).to.be.true;
  });

  describe('depends logic', () => {
    it('shows page when applicant is under 65 and has Social Security disability', () => {
      const formData = {
        isOver65: false,
        socialSecurityDisability: true,
        medicalCondition: false,
      };
      expect(additionalEvidence.depends(formData)).to.be.true;
    });

    it('shows page when applicant is under 65 and has medical condition', () => {
      const formData = {
        isOver65: false,
        socialSecurityDisability: false,
        medicalCondition: true,
      };

      expect(additionalEvidence.depends(formData)).to.be.true;
    });

    it('does not show page when applicant is 65 or older', () => {
      const formData = {
        isOver65: true,
        socialSecurityDisability: true,
        medicalCondition: true,
      };

      expect(additionalEvidence.depends(formData)).to.be.false;
    });
  });
});
