import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import veteranInformation from '../../../../config/chapters/01-veteran-and-claimant-information/otherVeteranInformation';
import {
  testComponentFieldsMarkedAsRequired,
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
  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      'va-text-input[label="Veteran’s first or given name"]',
      'va-text-input[label="Veteran’s last or family name"]',
      'va-text-input[label="Veteran’s Social Security number"]',
    ],
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
