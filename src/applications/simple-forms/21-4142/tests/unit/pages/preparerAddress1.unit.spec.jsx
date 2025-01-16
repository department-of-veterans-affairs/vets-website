import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../../shared/tests/pages/pageTests.spec';
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

const expectedNumberOfFields = 2;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

const expectedNumberOfErrors = 1;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  mockData,
);
