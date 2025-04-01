import formConfig from '../../../../config/form';
import { unassociatedIncomePages } from '../../../../config/chapters/03-unassociated-incomes/unassociatedIncomePages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
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
      'summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('income recipient page', () => {
    const schema =
      unassociatedIncomePages.unassociatedIncomeRecipientPage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeRecipientPage.uiSchema
        .unassociatedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      'root_otherRecipientRelationshipType',
    );
  });

  describe('recipient name page', () => {
    const schema =
      unassociatedIncomePages.unassociatedIncomeRecipientNamePage.schema
        .properties.unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeRecipientNamePage.uiSchema
        .unassociatedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1 },
      'recipient',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'recipient',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'recipient',
      {
        recipientName: 'Jane Doe',
      },
      { loggedIn: true },
    );
  });

  describe('income type page', () => {
    const schema =
      unassociatedIncomePages.unassociatedIncomeTypePage.schema.properties
        .unassociatedIncomes.items;
    const uiSchema =
      unassociatedIncomePages.unassociatedIncomeTypePage.uiSchema
        .unassociatedIncomes.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 1, input: 1 },
      'income type',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      2,
      'income type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'income type',
      testData.data.unassociatedIncomes[0],
      { loggedIn: true },
    );
  });
});
