import formConfig from '../../../../config/form';
import { annuityPages } from '../../../../config/chapters/09-annuities/annuityPages';
import testData from '../../../e2e/fixtures/data/test-data.json';
import {
  testNumberOfFieldsByType,
  testNumberOfErrorsOnSubmitForWebComponents,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('annuity list and loop pages', () => {
  const { annuityPagesSummary } = annuityPages;

  describe('summary page', () => {
    const { schema, uiSchema } = annuityPagesSummary;
    testNumberOfFieldsByType(
      formConfig,
      schema,
      uiSchema,
      { 'va-radio': 1 },
      'annuity summary page',
    );
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      1,
      'annuity summary page',
    );
    testSubmitsWithoutErrors(
      formConfig,
      schema,
      uiSchema,
      'annuity summary page',
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
