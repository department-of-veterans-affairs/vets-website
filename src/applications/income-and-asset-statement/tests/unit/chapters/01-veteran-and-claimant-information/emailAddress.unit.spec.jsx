import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import emailAddress from '../../../../config/chapters/01-veteran-and-claimant-information/emailAddress';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = emailAddress;

describe('income and asset current email page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 1,
    },
    'current email',
  );
  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    ['va-text-input[label="Email"]'],
    'current email',
  );
  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'current email',
    testData.data,
    { loggedIn: true },
  );
});
