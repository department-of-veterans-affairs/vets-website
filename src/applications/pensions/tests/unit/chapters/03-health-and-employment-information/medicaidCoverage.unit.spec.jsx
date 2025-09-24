import {
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicaidCoverage from '../../../../config/chapters/03-health-and-employment-information/medicaidCoverage';

const { schema, uiSchema } = medicaidCoverage;

describe('medicaid coverage pension page', () => {
  const pageTitle = 'medicaid coverage';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);
});
