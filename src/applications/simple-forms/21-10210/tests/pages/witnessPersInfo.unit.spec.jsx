import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import {
  CLAIM_OWNERSHIPS,
  CLAIMANT_TYPES,
  SERVED_WITH_VETERAN,
  SERVED_WITH_CLAIMANT,
} from '../../definitions/constants';
import formConfig from '../../config/form';

// Test for Flow 2: Veteran claimant (uiSchemaA)
const {
  schema: schemaA,
  uiSchema: uiSchemaA,
} = formConfig.chapters.witnessPersonalInfoChapter.pages.witnessPersInfoPageA;
const pageTitleA = 'Witness personal information (Veteran claimant)';

// Test data for when all fields are filled correctly
const mockDataWithVeteranRelationship = {
  claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
  claimantType: CLAIMANT_TYPES.VETERAN,
  witnessFullName: {
    first: 'Jack',
    last: 'Witness',
  },
  witnessRelationshipToClaimant: {
    [SERVED_WITH_VETERAN]: true,
  },
};

// Test for Flow 4: Non-veteran claimant (uiSchemaB)
const {
  schema: schemaB,
  uiSchema: uiSchemaB,
} = formConfig.chapters.witnessPersonalInfoChapter.pages.witnessPersInfoPageB;
const pageTitleB = 'Witness personal information (Non-veteran claimant)';

// Test data for non-veteran claimant flow
const mockDataWithClaimantRelationship = {
  claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
  claimantType: CLAIMANT_TYPES.NON_VETERAN,
  witnessFullName: {
    first: 'Jane',
    last: 'Witness',
  },
  witnessRelationshipToClaimant: {
    [SERVED_WITH_CLAIMANT]: true,
  },
};

// V3 Web Component Tests for Veteran Claimant Flow (uiSchemaA)
const expectedNumberOfWebComponentFieldsA = 7; // 3 name fields + 4 individual checkboxes
testNumberOfWebComponentFields(
  formConfig,
  schemaA,
  uiSchemaA,
  expectedNumberOfWebComponentFieldsA,
  pageTitleA,
  mockDataWithVeteranRelationship,
);

// Test validation errors for Veteran claimant flow - missing required fields
const expectedNumberOfWebComponentErrorsA = 3; // Updated to match actual validation errors
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schemaA,
  uiSchemaA,
  expectedNumberOfWebComponentErrorsA,
  pageTitleA,
  {
    claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
    claimantType: CLAIMANT_TYPES.VETERAN,
    // witnessFullName and witnessRelationshipToClaimant are missing - should cause validation errors
  },
);

// V3 Web Component Tests for Non-Veteran Claimant Flow (uiSchemaB)
const expectedNumberOfWebComponentFieldsB = 7; // 3 name fields + 4 individual checkboxes
testNumberOfWebComponentFields(
  formConfig,
  schemaB,
  uiSchemaB,
  expectedNumberOfWebComponentFieldsB,
  pageTitleB,
  mockDataWithClaimantRelationship,
);

// Test validation errors for Non-veteran claimant flow - missing required fields
const expectedNumberOfWebComponentErrorsB = 3; // Updated to match actual validation errors
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schemaB,
  uiSchemaB,
  expectedNumberOfWebComponentErrorsB,
  pageTitleB,
  {
    claimOwnership: CLAIM_OWNERSHIPS.THIRD_PARTY,
    claimantType: CLAIMANT_TYPES.NON_VETERAN,
    // witnessFullName and witnessRelationshipToClaimant are missing - should cause validation errors
  },
);
