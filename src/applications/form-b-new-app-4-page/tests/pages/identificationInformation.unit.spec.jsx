import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.identificationInformation;

const pageTitle = 'Identification information';

testNumberOfWebComponentFields(formConfig, schema, uiSchema, 2, pageTitle);

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  1,
  pageTitle,
);
