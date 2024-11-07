import formConfig from '../../../../config/form';
import { assetTransferPages } from '../../../../config/chapters/07-asset-transfers/assetTransferPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('asset transfer list and loop pages', () => {
  const { assetTransferPagesSummary } = assetTransferPages;

  describe('summary page', () => {
    const { schema, uiSchema } = assetTransferPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'asset transfer summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'asset transfer summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'asset transfer summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('relationship page', () => {
    //  Add unit tests for this page
  });

  describe('type page', () => {
    //  Add unit tests for this page
  });
});
