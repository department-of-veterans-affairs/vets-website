import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.witnessContactInfoChapter.pages.witnessContactInfoPage;
const pageTitle = 'Witness’ contact information';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
  claimantType: CLAIMANT_TYPES.NON_VETERAN,
  witnessPhone: '1234567890',
  witnessEmail: 'jack.witness@va.gov',
};

const expectedNumberOfWebComponentFields = 2;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
  mockData,
);

const expectedNumberOfWebComponentErrors = 2;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
  {
    claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
    claimantType: CLAIMANT_TYPES.NON_VETERAN,
  },
);

const expectedNumberOfFields = 0;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

const expectedNumberOfErrors = 0;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  {
    claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
    claimantType: CLAIMANT_TYPES.NON_VETERAN,
  },
);
