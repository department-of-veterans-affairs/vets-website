import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import claimantInformation from '../../../../config/chapters/01-veteran-and-claimant-information/claimantInformation';
import {
  testComponentFieldsMarkedAsRequired,
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
  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      'va-text-input[label="Your first or given name"]',
      'va-text-input[label="Your last or family name"]',
      'va-text-input[label="Your Social Security number"]',
    ],
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
