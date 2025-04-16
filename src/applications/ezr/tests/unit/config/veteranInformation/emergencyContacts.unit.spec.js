import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

const {
  chapters: {
    veteranInformation: {
      pages: { emergencyContactsSummary },
    },
  },
} = formConfig;

// Test for emergencyContactsSummary page
describe('Emergency Contacts Summary Page', () => {
  const { title: pageTitle, schema, uiSchema } = emergencyContactsSummary;

  // Include formData to satisfy dependencies
  const formData = { 'view:isEmergencyContactsEnabled': true };

  const expectedNumberOfWebComponentFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
    formData,
  );

  const expectedNumberOfWebComponentErrors = 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentErrors,
    pageTitle,
    formData,
  );
});
