import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import veteranInformation from '../../../../config/chapters/01-veteran-information/veteranInformation';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = veteranInformation;

describe('income and asset veteran information page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 5,
    },
    'veteran information',
  );
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    3,
    'veteran information',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'veteran information',
    testData.data,
    { loggedIn: true },
  );
});
