import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import incomeNetWorthDateRange from '../../../../config/chapters/02-claimant-information/incomeNetWorthDateRange';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = incomeNetWorthDateRange;

describe('income and asset statement date range page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-memorable-date': 2,
    },
    'statement date range',
  );
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    2,
    'statement date range',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'statement date range',
    testData.data,
    { loggedIn: true },
  );
});
