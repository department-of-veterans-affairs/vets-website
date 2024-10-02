import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';

// Destructure the pages from your formConfig
const {
  chapters: {
    emergencyContacts: {
      pages: {
        emergencyContactsSummary,
        emergencyContactsPage,
        emergencyContactsAddressPage,
      },
    },
  },
} = formConfig;

// Define tests for emergencyContactsSummary page
const {
  title: summaryTitle,
  schema: summarySchema,
  uiSchema: summaryUiSchema,
} = emergencyContactsSummary;

const expectedFieldsSummary = 1;
testNumberOfWebComponentFields(
  formConfig,
  summarySchema,
  summaryUiSchema,
  expectedFieldsSummary,
  summaryTitle,
);

const expectedErrorsSummary = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  summarySchema,
  summaryUiSchema,
  expectedErrorsSummary,
  summaryTitle,
);

// Define tests for emergencyContactsPage
const {
  title: contactsTitle,
  schema: contactsSchema,
  uiSchema: contactsUiSchema,
} = emergencyContactsPage;

const expectedFieldsContacts = 4;
testNumberOfWebComponentFields(
  formConfig,
  contactsSchema,
  contactsUiSchema,
  expectedFieldsContacts,
  contactsTitle,
);

const expectedErrorsContacts = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  contactsSchema,
  contactsUiSchema,
  expectedErrorsContacts,
  contactsTitle,
);

// Define tests for emergencyContactsAddressPage
const {
  title: addressTitle,
  schema: addressSchema,
  uiSchema: addressUiSchema,
} = emergencyContactsAddressPage;

const expectedFieldsAddress = 5;
testNumberOfWebComponentFields(
  formConfig,
  addressSchema,
  addressUiSchema,
  expectedFieldsAddress,
  addressTitle,
);

const expectedErrorsAddress = 5;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  addressSchema,
  addressUiSchema,
  expectedErrorsAddress,
  addressTitle,
);
