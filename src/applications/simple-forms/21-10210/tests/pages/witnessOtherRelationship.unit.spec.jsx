import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import {
  CLAIMANT_TYPES,
  OTHER_RELATIONSHIP,
} from '../../definitions/constants';
import formConfig from '../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.witnessPersonalInfoChapter.pages
    .witnessOtherRelationshipPage;
const pageTitle = 'Witness other relationship';

// Test data for when field should be visible (other relationship selected)
const mockDataWithOtherRelationship = {
  claimantType: CLAIMANT_TYPES.VETERAN,
  witnessRelationshipToClaimant: {
    [OTHER_RELATIONSHIP]: true,
  },
  witnessOtherRelationshipToClaimant: 'Met at a bar.',
};

// Test with v3 web components - field should be visible
const expectedNumberOfWebComponentFields = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
  mockDataWithOtherRelationship,
);

// Test validation with v3 web components - required field missing
const expectedNumberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
  {
    claimantType: CLAIMANT_TYPES.VETERAN,
    witnessRelationshipToClaimant: {
      [OTHER_RELATIONSHIP]: true,
    },
    // witnessOtherRelationshipToClaimant is missing - should cause validation error
  },
);
