import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import claimantType from '../../../../config/chapters/01-veteran-and-claimant-information/claimantType';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = claimantType;

describe('income and asset claimant type page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    'claimant type',
  );
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    1,
    'claimant type',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'claimant type',
    testData.data,
    { loggedIn: true },
  );
});
