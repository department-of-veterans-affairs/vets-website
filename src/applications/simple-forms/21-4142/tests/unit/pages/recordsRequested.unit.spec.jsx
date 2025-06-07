import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../../shared/tests/pages/pageTests.spec';
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

if (environment.isProduction()) {
  const expectedNumberOfFields = 14;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
    mockDataForVeteranIsSelf,
  );

  const expectedNumberOfErrors = 8;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
    mockDataForVeteranIsSelf,
  );
}
