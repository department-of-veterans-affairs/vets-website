import formConfig from '../../../../config/form';
import { trustPages } from '../../../../config/chapters/08-trusts/trustPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('trust list and loop pages', () => {
  const { trustPagesSummary } = trustPages;

  describe('summary page', () => {
    const { schema, uiSchema } = trustPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'trust summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'trust summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'trust summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('information page', () => {
    //  Add unit tests for this page
  });

  describe('type page', () => {
    //  Add unit tests for this page
  });
});
