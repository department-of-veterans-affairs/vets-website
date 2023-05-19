import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranContactInfo.pages.veteranContactInfo1;
const pageTitle = 'Veteran’s contact information';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.SELF,
  claimantType: CLAIMANT_TYPES.VETERAN,
  veteranPhone: '1234567890',
  veteranEmail: 'john.veteran@va.gov',
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
    claimOwnership: CLAIM_OWNERSHIPS.SELF,
    claimantType: CLAIMANT_TYPES.VETERAN,
  },
);
