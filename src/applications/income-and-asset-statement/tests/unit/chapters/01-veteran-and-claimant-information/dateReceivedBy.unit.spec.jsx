import testData from '../../../e2e/fixtures/data/test-data.json';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import dateReceivedBy from '../../../../config/chapters/01-veteran-and-claimant-information/dateReceivedBy';

const { schema, uiSchema } = dateReceivedBy;

describe('income and asset statement date received by page', () => {
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    'date received by',
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    'date received by',
  );

  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'date received by',
    testData.data,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    'date received by',
  );
});
