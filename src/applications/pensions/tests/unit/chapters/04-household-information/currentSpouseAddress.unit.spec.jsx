import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import currentSpouseAddress from '../../../../config/chapters/04-household-information/currentSpouseAddress';

describe('current spouse address page', () => {
  const pageTitle = 'current spouse address';
  const expectedNumberOfFields = 6;
  testNumberOfWebComponentFields(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 4;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    {
      'va-text-input': 5,
      'va-select': 1,
    },
    pageTitle,
  );
});
