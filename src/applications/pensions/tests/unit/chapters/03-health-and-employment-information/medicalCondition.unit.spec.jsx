import { expect } from 'chai';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicalConditions from '../../../../config/chapters/03-health-and-employment-information/medicalConditions';

const { schema, uiSchema } = medicalConditions;

describe('pension medical condition page', () => {
  const pageTitle = 'medical condition information';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-radio[label="Do you have a medical condition that prevents you from working?"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );

  describe('depends logic', () => {
    it('shows page when applicant is under 65 and has no Social Security disability', () => {
      const formData = {
        isOver65: false,
        socialSecurityDisability: false,
      };
      expect(medicalConditions.depends(formData)).to.be.true;
    });

    it('does not show page when applicant is 65 or older and has no Social Security disability', () => {
      const formData = {
        isOver65: true,
        socialSecurityDisability: false,
      };
      expect(medicalConditions.depends(formData)).to.be.false;
    });

    it('does not show page when applicant is 65 or older', () => {
      const formData = {
        isOver65: true,
      };

      expect(medicalConditions.depends(formData)).to.be.false;
    });
  });
});
