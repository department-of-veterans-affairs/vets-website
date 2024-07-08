import formConfig from '../../../../config/form';
import { unassociatedIncomePages } from '../../../../config/chapters/03-unassociated-incomes/unassociatedIncomePages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('unassociated income list and loop pages', () => {
  const { unassociatedIncomePagesSummary } = unassociatedIncomePages;

  describe('summary page', () => {
    const { schema, uiSchema } = unassociatedIncomePagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'unassociated income summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'unassociated income summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'unassociated income summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('income recipient page', () => {
    //  Add unit tests for this page
  });

  describe('income type page', () => {
    //  Add unit tests for this page
  });
});
