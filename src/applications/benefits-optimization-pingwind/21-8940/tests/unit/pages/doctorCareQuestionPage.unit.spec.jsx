import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { doctorCareQuestionFields } from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.sectionTwoP1Chapter.pages.doctorCareQuestionPage;
const pageTitleTrue = "doctor's care question - has received doctor care";
const pageTitleFalse = "doctor's care question - has not received doctor care";

const mockDataTrue = {
  [doctorCareQuestionFields.parentObject]: {
    [doctorCareQuestionFields.hasReceivedDoctorCare]: true,
  },
};
const mockDataFalse = {
  [doctorCareQuestionFields.parentObject]: {
    [doctorCareQuestionFields.hasReceivedDoctorCare]: false,
  },
};

const expectedNumberOfFieldsTrue = 1;
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

const expectedNumberOfErrorsTrue = 0;
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
