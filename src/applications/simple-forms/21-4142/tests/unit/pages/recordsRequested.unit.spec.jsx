import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { patientIdentificationFields } from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.recordsRequested.pages.recordsRequested;

const pageTitle = 'records requested';

const mockDataForVeteranIsSelf = {
  [patientIdentificationFields.parentObject]: {
    [patientIdentificationFields.isRequestingOwnMedicalRecords]: true,
  },
};

const expectedNumberOfFields = 0;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockDataForVeteranIsSelf,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  mockDataForVeteranIsSelf,
);
