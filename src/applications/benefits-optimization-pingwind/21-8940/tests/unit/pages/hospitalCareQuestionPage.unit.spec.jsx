import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { hospitalizationQuestionFields } from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.sectionTwoP1Chapter.pages.hospitalCareQuestionPage;
const pageTitleTrue = 'hospital care question - has been hospitalized';
const pageTitleFalse = 'hospital care question - has not been hospitalized';

const mockDataTrue = {
  [hospitalizationQuestionFields.parentObject]: {
    [hospitalizationQuestionFields.hasBeenHospitalized]: true,
  },
};

const mockDataFalse = {
  [hospitalizationQuestionFields.parentObject]: {
    [hospitalizationQuestionFields.hasBeenHospitalized]: false,
  },
};

const expectedNumberOfFieldsTrue = 2;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFieldsTrue,
  pageTitleTrue,
  mockDataTrue,
);

const expectedNumberOfFieldsFalse = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFieldsFalse,
  pageTitleFalse,
  mockDataFalse,
);

const expectedNumberOfErrorsTrue = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrorsTrue,
  pageTitleTrue,
  mockDataTrue,
);

const expectedNumberOfErrorsFalse = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrorsFalse,
  pageTitleFalse,
  mockDataFalse,
);
