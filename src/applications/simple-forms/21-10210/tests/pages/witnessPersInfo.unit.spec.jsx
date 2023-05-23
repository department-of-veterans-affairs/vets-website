import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.witnessPersonalInfoChapter.pages.witnessPersonalInfoPage;
const pageTitle = 'Witness’ personal information';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
  claimantType: CLAIMANT_TYPES.NON_VETERAN,
  witnessFullName: {
    first: 'Jack',
    last: 'Witness',
  },
  witnessRelationshipToClaimant: 'Served with Claimant',
};

// Expect 4 fields instead of 7 fields.
// witnessRelationshipToClaimant checkbox-group's 3 fields are
// in shadow-DOM and thus unselectable by test.
const expectedNumberOfFields = 4;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

// Expect 4 instead of 7 errors.
// witnessRelationshipToClaimant checkbox-group only displays
// 1 error-message for its 3 shadow-DOM fields.
const expectedNumberOfErrors = 4;
testNumberOfErrorsOnSubmit(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  {
    claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
    claimantType: CLAIMANT_TYPES.VETERAN,
  },
);
