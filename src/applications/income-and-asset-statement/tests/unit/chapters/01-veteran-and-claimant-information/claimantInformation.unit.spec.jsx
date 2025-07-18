import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import claimantInformation from '../../../../config/chapters/01-veteran-and-claimant-information/claimantInformation';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = claimantInformation;

describe('income and asset claimant information page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 4,
    },
    'claimant information',
  );
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    3,
    'claimant information',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'claimant information',
    testData.data,
    { loggedIn: true },
  );
});
