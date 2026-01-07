import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { employmentAppliedFields } from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.employmentAppliedChapter.pages.employmentHistorySummary;

const pageTitle = 'employment application record';

const mockDataForVeteranIsSelf = {
  [employmentAppliedFields.parentObject]: {
    [employmentAppliedFields.hasTriedEmployment]: true,
  },
};

const expectedNumberOfFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockDataForVeteranIsSelf,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  mockDataForVeteranIsSelf,
);
