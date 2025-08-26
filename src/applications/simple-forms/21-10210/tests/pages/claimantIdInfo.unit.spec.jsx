import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../shared/tests/pages/pageTests.spec';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.claimantIdInfoChapter.pages.claimantIdInfoPage;
const pageTitle = 'Claimant’s identification information';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.SELF,
  claimantType: CLAIMANT_TYPES.NON_VETERAN,
  claimantSSN: '321540988',
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

const expectedNumberOfWebComponentErrors = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
  {
    claimOwnership: CLAIM_OWNERSHIPS.SELF,
    claimantType: CLAIMANT_TYPES.NON_VETERAN,
  },
);

const expectedNumberOfFields = 1;
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
    claimOwnership: CLAIM_OWNERSHIPS.SELF,
    claimantType: CLAIMANT_TYPES.NON_VETERAN,
  },
);
