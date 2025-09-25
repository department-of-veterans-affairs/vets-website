import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.patientIdentificationChapter.pages.patientIdentification2;

const pageTitle = 'patient identification 2';

const numberOfWebComponentFields = 6;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

const numberOfWebComponentErrors = 3;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
