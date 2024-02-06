import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
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
});
