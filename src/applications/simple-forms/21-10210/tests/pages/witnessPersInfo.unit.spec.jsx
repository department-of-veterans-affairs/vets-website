import {
  // testNumberOfErrorsOnSubmit,
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
  witnessRelationshipToClaimant: {
    'served-with': true,
    'family-or-friend': false,
    'coworker-or-supervisor': false,
  },
};

const expectedNumberOfFields = 7;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

// TODO: Once Relationship checkboxes validation error-messaging is fixed,
// add testNumberOfErrorsOnSubmit().
// GitHub bug: https://github.com/department-of-veterans-affairs/va.gov-team-forms/issues/255
