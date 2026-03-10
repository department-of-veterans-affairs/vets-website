import { expect } from 'chai';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import socialSecurityDisability from '../../../../config/chapters/03-health-and-employment-information/socialSupplementalSecurity';

const { schema, uiSchema } = socialSecurityDisability;

describe('pension social security disability page', () => {
  const pageTitle = 'health history';
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
      `va-radio[label="Do you currently receive Social Security disability payments?"]`,
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
    it('shows page when applicant is under 65', () => {
      const formData = {
        isOver65: false,
      };
      expect(socialSecurityDisability.depends(formData)).to.be.true;
    });

    it('does not show page when applicant is 65 or older', () => {
      const formData = {
        isOver65: true,
      };

      expect(socialSecurityDisability.depends(formData)).to.be.false;
    });
  });
});
