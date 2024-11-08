import formConfig from '../../../../config/form';
import { royaltiesAndOtherPropertyPages } from '../../../../config/chapters/06-royalties-and-other-properties/royaltiesAndOtherPropertyPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('royalties list and loop pages', () => {
  const { royaltyPagesSummary } = royaltiesAndOtherPropertyPages;

  describe('summary page', () => {
    const { schema, uiSchema } = royaltyPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'royalties and other property summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'royalties and other property summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'royalties and other property summary page',
      testData.data,
      { loggedIn: true },
    );
  });

  describe('recipient page', () => {
    //  Add unit tests for this page
  });

  describe('type page', () => {
    //  Add unit tests for this page
  });
});
