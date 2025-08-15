import formConfig from '../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFormFields,
} from '../../helpers.spec';
import {
  idFormSchema as schema,
  idFormUiSchema as uiSchema,
} from '../../../definitions/idForm';

describe('hca IDForm config', () => {
  const pageTitle = 'Veteran Identity Verification';

  // run test for correct number of fields on the page
  const expectedNumberOfFields = 8;
  testNumberOfFormFields(
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
