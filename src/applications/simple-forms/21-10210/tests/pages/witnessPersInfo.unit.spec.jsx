import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import {
  CLAIM_OWNERSHIPS,
  CLAIMANT_TYPES,
  SERVED_WITH_VETERAN,
} from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.witnessPersonalInfoChapter.pages.witnessPersInfoPageA;
const pageTitle = 'Witness’ personal information';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
  claimantType: CLAIMANT_TYPES.NON_VETERAN,
  witnessFullName: {
    first: 'Jack',
    last: 'Witness',
  },
  witnessRelationshipToClaimant: SERVED_WITH_VETERAN,
};

// Expect 4 fields instead of 7 fields.
// witnessRelationshipToClaimant GroupCheckboxWidget's 3 fields are
// in shadow-DOM and thus unselectable by test.
const expectedNumberOfFields = 3;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

// Expect 3 instead of 7 errors.
// witnessRelationshipToClaimant GroupCheckboxWidget displays
// only 1 error-message for its 3 shadow-DOM fields.
const expectedNumberOfErrors = 3;
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
