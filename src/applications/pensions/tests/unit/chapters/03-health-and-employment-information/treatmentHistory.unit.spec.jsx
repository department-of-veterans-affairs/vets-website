import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import treatmentHistory from '../../../../config/chapters/03-health-and-employment-information/vaTreatmentHistory';
import generateMedicalCentersSchemas from '../../../../config/chapters/03-health-and-employment-information/medicalCenters';

describe('pension treatment history page', () => {
  const pageTitle = 'treatment history';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    treatmentHistory.schema,
    treatmentHistory.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    treatmentHistory.schema,
    treatmentHistory.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});

describe('pension add medical centers page', () => {
  const medicalCenters = generateMedicalCentersSchemas();
  const pageTitle = 'medical centers';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    medicalCenters.schema,
    medicalCenters.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    medicalCenters.schema,
    medicalCenters.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
