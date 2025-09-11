import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import {
  preparerIdentificationFields,
  veteranFields,
  veteranIsSelfText,
} from '../../../definitions/constants';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddress.pages.preparerAddress1;

const pageTitle = 'preparer address 1';

const mockData = {
  [veteranFields.parentObject]: {
    [veteranFields.address]: {
      street: '1 street',
      city: 'city',
      state: 'AL',
      postalCode: '15541',
    },
  },
  [preparerIdentificationFields.parentObject]: {
    [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
  },
};

const numberOfWebComponentFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentFields,
  pageTitle,
  mockData,
);

const numberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  numberOfWebComponentErrors,
  pageTitle,
  mockData,
);
