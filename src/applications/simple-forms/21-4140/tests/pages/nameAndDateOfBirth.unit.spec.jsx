import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from 'platform/forms-system/test/pageTestHelpers.spec';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformationChapter.pages.nameAndDateOfBirth;

const pageTitle = 'Name and date of birth';

testNumberOfWebComponentFields(formConfig, schema, uiSchema, 4, pageTitle);

testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  3,
  pageTitle,
);
