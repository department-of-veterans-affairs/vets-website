import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.authorizationChapter.pages.authorization;

const pageTitle = 'authorization';

const numberOfWebComponentFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

const numberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
