import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.employmentHistoryChapter.pages.currentMilitaryService;

const pageTitleNotServing = 'current military service - not currently serving';
const pageTitleServing = 'current military service - currently serving';
const pageTitleServingComplete =
  'current military service - currently serving with responses';

const mockDataNotServing = {
  currentlyServing: false,
};

const mockDataServingMissingOrders = {
  currentlyServing: true,
};

const mockDataServingComplete = {
  currentlyServing: true,
  activeDutyOrders: false,
};

const expectedFieldsNotServing = 1;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedFieldsNotServing,
  pageTitleNotServing,
  mockDataNotServing,
);

const expectedFieldsServing = 2;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedFieldsServing,
  pageTitleServing,
  mockDataServingMissingOrders,
);

const expectedErrorsNotServing = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedErrorsNotServing,
  pageTitleNotServing,
  mockDataNotServing,
);

const expectedErrorsServingMissingOrders = 1;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedErrorsServingMissingOrders,
  pageTitleServing,
  mockDataServingMissingOrders,
);

const expectedErrorsServingComplete = 0;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedErrorsServingComplete,
  pageTitleServingComplete,
  mockDataServingComplete,
);

describe('8940 currentMilitaryService schema basics', () => {
  it('requires a response for currentlyServing', () => {
    expect(schema.required).to.include('currentlyServing');
  });

  it('does not require activeDutyOrders at the schema level', () => {
    expect(schema.required).to.not.include('activeDutyOrders');
  });
});
