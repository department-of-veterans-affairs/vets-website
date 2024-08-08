import formConfig from '../../../../config/form';
import { associatedIncomePages } from '../../../../config/chapters/04-associated-incomes/associatedIncomePages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('associated income list and loop pages', () => {
  const { associatedIncomePagesSummary } = associatedIncomePages;

  describe('summary page', () => {
    const { schema, uiSchema } = associatedIncomePagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'associated income summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'associated income summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'associated income summary page',
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
