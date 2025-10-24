import { expect } from 'chai';
import formConfig from '../../../../config/form';
import {
  assetTransferPages,
  options,
} from '../../../../config/chapters/06-asset-transfers/assetTransferPages';
import { transferMethodLabels } from '../../../../labels';

import testData from '../../../e2e/fixtures/data/test-data.json';
import testDataZeroes from '../../../e2e/fixtures/data/test-data-all-zeroes.json';

import {
  testOptionsIsItemIncomplete,
  testOptionsIsItemIncompleteWithZeroes,
  testOptionsTextCardDescription,
} from '../multiPageTests.spec';
import {
  testNumberOfFieldsByType,
  testComponentFieldsMarkedAsRequired,
  testSelectAndValidateField,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('asset transfer list and loop pages', () => {
  const { assetTransferPagesSummary } = assetTransferPages;

  describe('isItemIncomplete function', () => {
    // eslint-disable-next-line no-unused-vars
    const { saleValue, ...baseItem } = testData.data.assetTransfers[0];
    testOptionsIsItemIncomplete(options, baseItem);
  });

  describe('isItemIncomplete function tested with zeroes', () => {
    // eslint-disable-next-line no-unused-vars
    const { saleValue, ...baseItem } = testDataZeroes.data.assetTransfers[0];
    testOptionsIsItemIncompleteWithZeroes(options, baseItem);
  });

  describe('text getItemName function', () => {
    it('should return "Asset sold to `newOwnerName`', () => {
      const item = testData.data.assetTransfers[0];
      expect(options.text.getItemName(item)).to.equal(
        'Asset sold to Alice Johnson',
      );
    });
  });

  describe('text cardDescription function', () => {
    /* eslint-disable no-unused-vars */
    const {
      originalOwnerRelationship,
      transferMethod,
      newOwnerName,
      newOwnerRelationship,
      saleReportedToIrs,
      assetTransferredUnderFairMarketValue,
      saleValue,
      ...baseItem
    } = testData.data.assetTransfers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, transferMethodLabels);
  });

  describe('text cardDescription function with zero values', () => {
    /* eslint-disable no-unused-vars */
    const {
      originalOwnerRelationship,
      transferMethod,
      newOwnerName,
      newOwnerRelationship,
      saleReportedToIrs,
      assetTransferredUnderFairMarketValue,
      saleValue,
      ...baseItem
    } = testDataZeroes.data.assetTransfers[0];
    /* eslint-enable no-unused-vars */
    testOptionsTextCardDescription(options, baseItem, transferMethodLabels);
  });

  describe('summary page', () => {
    const { schema, uiSchema } = assetTransferPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'summary page',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="In this year or in the past 3 tax years, did you or your dependents transfer any assets?"]',
      ],
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

  describe('relationship page', () => {
    const schema =
      assetTransferPages.assetTransferNonVeteranRecipientPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferNonVeteranRecipientPage.uiSchema
        .assetTransfers.items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'relationship',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-radio[label="What is the asset’s original owner’s relationship to the Veteran?"]',
      ],
      'relationship',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
    testSelectAndValidateField(
      formConfig,
      schema,
      uiSchema,
      'relationship',
      'root_otherOriginalOwnerRelationshipType',
    );
  });

  describe('information page', () => {
    const schema =
      assetTransferPages.assetTransferInformationPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferInformationPage.uiSchema.assetTransfers
        .items;

    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-text-input': 1, 'va-memorable-date': 1 },
      'type',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-text-input[label="What asset was transferred?"]'],
      ['va-memorable-date[label="When was the asset transferred?"]'],
      'type',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'type',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('new owner page', () => {
    const schema =
      assetTransferPages.assetTransferNewOwnerPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferNewOwnerPage.uiSchema.assetTransfers
        .items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-text-input': 4,
      },
      'new owner information',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      [
        'va-text-input[label="First or given name"]',
        'va-text-input[label="Last or family name"]',
        'va-text-input[label="What’s their relationship to the original asset owner?"]',
      ],
      'new owner information',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'new owner information',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('transfer method page', () => {
    const schema =
      assetTransferPages.assetTransferMethodPage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferMethodPage.uiSchema.assetTransfers.items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-radio': 1,
      },
      'value',
    );
    testComponentFieldsMarkedAsRequired(
      formConfig,
      schema,
      uiSchema,
      ['va-radio[label="How was this asset transferred?"]'],
      'value',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'value',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });

  describe('fair value page', () => {
    const schema =
      assetTransferPages.assetTransferMarketValuePage.schema.properties
        .assetTransfers.items;
    const uiSchema =
      assetTransferPages.assetTransferMarketValuePage.uiSchema.assetTransfers
        .items;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      {
        'va-radio': 2,
        'va-text-input': 3,
      },
      'value',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'value',
      testData.data.assetTransfers[0],
      { loggedIn: true },
    );
  });
});
