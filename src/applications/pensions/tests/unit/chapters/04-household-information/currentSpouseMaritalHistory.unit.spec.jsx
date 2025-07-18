import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import currentSpouseMaritalHistory from '../../../../config/chapters/04-household-information/currentSpouseMaritalHistory';

describe('current spouse marital history', () => {
  const pageTitle = 'current spouse marital history';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    currentSpouseMaritalHistory.schema,
    currentSpouseMaritalHistory.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    currentSpouseMaritalHistory.schema,
    currentSpouseMaritalHistory.uiSchema,
    [`va-radio[label="Has your spouse been married before?"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    currentSpouseMaritalHistory.schema,
    currentSpouseMaritalHistory.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    currentSpouseMaritalHistory.schema,
    currentSpouseMaritalHistory.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});
