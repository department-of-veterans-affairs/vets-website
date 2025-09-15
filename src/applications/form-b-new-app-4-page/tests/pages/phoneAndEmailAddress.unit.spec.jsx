import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformationChapter.pages.phoneAndEmailAddress;

const pageTitle = 'Phone and email address';

testNumberOfWebComponentFields(formConfig, schema, uiSchema, 3, pageTitle);

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  1,
  pageTitle,
);
