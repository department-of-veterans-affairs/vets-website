import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import veteranInformation from '../../../../config/chapters/01-veteran-and-claimant-information/veteranInformation';
import {
  testComponentFieldsMarkedAsRequired,
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
  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      'va-text-input[label="Veteran’s first name"]',
      'va-text-input[label="Veteran’s last name"]',
      'va-text-input[label="Veteran’s Social Security number"]',
    ],
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
