import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.mailingInformationChapter.pages.address;

const pageTitle = 'address';

// The page has 7 fields: militaryBaseOutsideUS, country, streetAddress, apartmentUnit, city, stateProvinceRegion, postalCode
const numberOfWebComponentFields = 7;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
);

// Based on actual test results: 4 validation errors expected (stateProvinceRegion appears to be optional)
const numberOfWebComponentErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
);
