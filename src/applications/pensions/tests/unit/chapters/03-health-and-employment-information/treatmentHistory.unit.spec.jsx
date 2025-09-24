import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import treatmentHistory from '../../../../config/chapters/03-health-and-employment-information/vaTreatmentHistory';
import { generateMedicalCentersSchemas } from '../../../../config/chapters/03-health-and-employment-information/helpers';

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

  testComponentFieldsMarkedAsRequired(
    formConfig,
    treatmentHistory.schema,
    treatmentHistory.uiSchema,
    [`va-radio[label="Have you received treatment from a VA medical center?"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    treatmentHistory.schema,
    treatmentHistory.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    treatmentHistory.schema,
    treatmentHistory.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});

describe('pension add medical centers page', () => {
  const medicalCenters = generateMedicalCentersSchemas(
    'medicalCenters',
    'VA medical centers',
    'Enter all VA medical centers where you have received treatment',
    'VA medical center',
    'VA medical centers',
  );
  const pageTitle = 'medical centers';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    medicalCenters.schema,
    medicalCenters.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    medicalCenters.schema,
    medicalCenters.uiSchema,
    [`va-text-input[label="VA medical center"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    medicalCenters.schema,
    medicalCenters.uiSchema,
    pageTitle,
    {
      medicalCenters: [{ medicalCenter: 'Generic Medical Center' }],
    },
  );

  testNumberOfFieldsByType(
    formConfig,
    medicalCenters.schema,
    medicalCenters.uiSchema,
    {
      'va-text-input': 1,
    },
    pageTitle,
  );
});
