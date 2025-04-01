import formConfig from '../../../../config/form';
import { associatedIncomePages } from '../../../../config/chapters/04-associated-incomes/associatedIncomePages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSelectAndValidateField,
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
      associatedIncomePages.associatedIncomeRecipientPage.schema.properties
        .associatedIncomes.items;
    const uiSchema =
      associatedIncomePages.associatedIncomeRecipientPage.uiSchema
        .associatedIncomes.items;

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
      testData.data.associatedIncomes[0],
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
      associatedIncomePages.associatedIncomeRecipientNamePage.schema.properties
        .associatedIncomes.items;
    const uiSchema =
      associatedIncomePages.associatedIncomeRecipientNamePage.uiSchema
        .associatedIncomes.items;

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
      associatedIncomePages.associatedIncomeTypePage.schema.properties
        .associatedIncomes.items;
    const uiSchema =
      associatedIncomePages.associatedIncomeTypePage.uiSchema.associatedIncomes
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1, 'va-text-input': 1, input: 2 },
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
      testData.data.associatedIncomes[0],
      { loggedIn: true },
    );
  });
});
