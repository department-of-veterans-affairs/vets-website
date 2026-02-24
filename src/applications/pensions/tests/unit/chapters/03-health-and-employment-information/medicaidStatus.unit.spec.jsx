import {
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicaidStatus from '../../../../config/chapters/03-health-and-employment-information/medicaidStatus';

const { schema, uiSchema } = medicaidStatus;

describe('medicaid status pension page', () => {
  const pageTitle = 'medicaid status';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
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
});
