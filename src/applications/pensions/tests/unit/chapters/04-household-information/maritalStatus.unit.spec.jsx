import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import maritalStatus from '../../../../config/chapters/04-household-information/maritalStatus';

describe('marital status page', () => {
  const pageTitle = 'marital status';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    maritalStatus.schema,
    maritalStatus.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    maritalStatus.schema,
    maritalStatus.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
