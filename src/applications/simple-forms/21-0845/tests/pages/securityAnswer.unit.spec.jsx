import { cloneDeep } from 'lodash';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.securityInfoChapter.pages.secAnswerPage;

const testUiSchema = cloneDeep(uiSchema);
testUiSchema['ui:title'] = 'Your answer';

const pageTitle = 'Security answer';

const expectedNumberOfFields = 1;
testNumberOfFields(
  formConfig,
  schema,
  testUiSchema,
  expectedNumberOfFields,
  pageTitle,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  testUiSchema,
  expectedNumberOfErrors,
  pageTitle,
);
