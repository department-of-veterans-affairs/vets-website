import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.employmentHistoryChapter.pages.leavingLastPosition;

const pageTitle = 'leaving last position';
const pageTitleComplete = 'leaving last position with responses';

const mockDataComplete = {
  leftDueToDisability: true,
  receivesDisabilityRetirement: false,
  receivesWorkersCompensation: false,
};

const expectedFieldCount = 3;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedFieldCount,
  pageTitle,
);

const expectedErrorCount = 3;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedErrorCount,
  pageTitle,
);

const expectedErrorCountComplete = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedErrorCountComplete,
  pageTitleComplete,
  mockDataComplete,
);

describe('8940 leavingLastPosition schema basics', () => {
  it('requires all leaving last position responses', () => {
    expect(schema.required).to.include('leftDueToDisability');
    expect(schema.required).to.include('receivesDisabilityRetirement');
    expect(schema.required).to.include('receivesWorkersCompensation');
  });
});
