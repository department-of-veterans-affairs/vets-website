import formConfig from '../../../../config/form';
import { ownedAssetPages } from '../../../../config/chapters/05-owned-assets/ownedAssetPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('associated income list and loop pages', () => {
  const { ownedAssetPagesSummary } = ownedAssetPages;

  describe('summary page', () => {
    const { schema, uiSchema } = ownedAssetPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'owned asset summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'owned asset summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'owned asset summary page',
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
