import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
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

const expectedNumberOfFields = 2;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

const expectedNumberOfErrors = 2;
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
