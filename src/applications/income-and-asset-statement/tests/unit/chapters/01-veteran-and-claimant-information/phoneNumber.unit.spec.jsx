import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import phoneNumber from '../../../../config/chapters/01-veteran-and-claimant-information/phoneNumber';
import {
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = phoneNumber;

describe('income and asset phone number page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 1,
    },
    'phone number',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'phone number',
    testData.data,
    { loggedIn: true },
  );
});
