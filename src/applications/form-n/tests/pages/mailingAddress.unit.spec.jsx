import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.mailingAddressChapter.pages.mailingAddress;

const pageTitle = 'Mailing address';

testNumberOfWebComponentFields(formConfig, schema, uiSchema, 7, pageTitle);

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  4,
  pageTitle,
);
