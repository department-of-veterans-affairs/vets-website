import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import veteranInformation from '../../../../config/chapters/01-veteran-and-claimant-information/otherVeteranInformation';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = veteranInformation;

describe('income and asset other veteran information page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 5,
    },
    'other veteran information',
  );
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    3,
    'other veteran information',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'other veteran information',
    testData.data,
    { loggedIn: true },
  );
});
