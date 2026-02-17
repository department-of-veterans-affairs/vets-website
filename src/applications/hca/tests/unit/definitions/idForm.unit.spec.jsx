import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';
import {
  idFormSchema as schema,
  idFormUiSchema as uiSchema,
} from '../../../definitions/idForm';

describe('hca IDForm config', () => {
  const pageTitle = 'Veteran Identity Verification';

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 8;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // run test for correct number of error messages on submit
  const expectedNumberOfErrors = 4;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
