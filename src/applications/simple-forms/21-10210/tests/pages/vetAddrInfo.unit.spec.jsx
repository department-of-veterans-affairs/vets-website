import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranMailingAddressInfo.pages.veteranMailingAddressInfo1;
const pageTitle = 'Veteran’s mailing address';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.SELF,
  claimantType: CLAIMANT_TYPES.VETERAN,
  veteranMailingAddress: {
    country: 'USA',
    street: '123 Any St',
    city: 'Anytown',
    state: 'AL',
    postalCode: '54321',
  },
};

const expectedNumberOfFields = 6;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  {
    claimOwnership: CLAIM_OWNERSHIPS.SELF,
    claimantType: CLAIMANT_TYPES.VETERAN,
  },
);
