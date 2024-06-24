import testData from '../../../e2e/fixtures/data/test-data.json';

import formConfig from '../../../../config/form';
import applicantIsVeteran from '../../../../config/chapters/01-veteran-information/applicantIsVeteran';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const { schema, uiSchema } = applicantIsVeteran;

describe('income and asset applicant is veteran page', () => {
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    'veteran information',
  );
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    1,
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
