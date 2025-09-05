import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformation1Chapter.pages.contactInformation1;

const pageTitle = 'contact information 1';

const numberOfWebComponentFields = 7;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

const numberOfWebComponentErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
