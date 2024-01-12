import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
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

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    currentSpouseMaritalHistory.schema,
    currentSpouseMaritalHistory.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
