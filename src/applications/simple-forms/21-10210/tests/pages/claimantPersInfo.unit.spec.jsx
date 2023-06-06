import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../shared/tests/pages/pageTests.spec';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.claimantPersonalInfoChapter.pages.claimantPersInfoPage;
const pageTitle = 'Claimant’s personal information';
const mockData = {
  claimOwnership: CLAIM_OWNERSHIPS.SELF,
  claimantType: CLAIMANT_TYPES.NON_VETERAN,
  claimantFullName: {
    first: 'Joe',
    last: 'Claimant',
  },
  claimantDateOfBirth: '1980-01-01',
};

const expectedNumberOfFields = 6;
testNumberOfFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  mockData,
);

const expectedNumberOfErrors = 3;
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
