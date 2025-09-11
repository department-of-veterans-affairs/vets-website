import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import {
  preparerIdentificationFields,
  veteranIsSelfText,
} from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddress.pages.preparerAddress2;

const pageTitle = 'preparer address 2';

const mockData = {
  [preparerIdentificationFields.parentObject]: {
    [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
    [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: false,
  },
};

const numberOfWebComponentFields = 6;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
  mockData,
);

const numberOfWebComponentErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
  mockData,
);
