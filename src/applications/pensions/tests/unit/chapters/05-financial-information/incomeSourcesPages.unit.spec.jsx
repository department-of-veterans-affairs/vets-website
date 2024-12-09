import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import { incomeSourcesPages } from '../../../../config/chapters/05-financial-information/incomeSourcesPages';

describe('income sources summary page', () => {
  const { incomeSourcesSummary } = incomeSourcesPages;
  const pageTitle = 'income sources summary';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    incomeSourcesSummary.schema,
    incomeSourcesSummary.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    incomeSourcesSummary.schema,
    incomeSourcesSummary.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    incomeSourcesSummary.schema,
    incomeSourcesSummary.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    incomeSourcesSummary.schema,
    incomeSourcesSummary.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});

// To do: Figure out why this wont work like the summary page
// describe('income source type page', () => {
//   const { incomeTypePage } = incomeSourcesPages;
//   const pageTitle = 'income source type';
//   const expectedNumberOfFields = 1;
//   testNumberOfWebComponentFields(
//     formConfig,
//     incomeTypePage.schema,
//     incomeTypePage.uiSchema,
//     expectedNumberOfFields,
//     pageTitle,
//   );

//   const expectedNumberOfErrors = 1;
//   testNumberOfErrorsOnSubmitForWebComponents(
//     formConfig,
//     incomeTypePage.schema,
//     incomeTypePage.uiSchema,
//     expectedNumberOfErrors,
//     pageTitle,
//   );

//   testSubmitsWithoutErrors(
//     formConfig,
//     incomeTypePage.schema,
//     incomeTypePage.uiSchema,
//     pageTitle,
//   );

//   testNumberOfFieldsByType(
//     formConfig,
//     incomeTypePage.schema,
//     incomeTypePage.uiSchema,
//     {
//       'va-radio': 1,
//     },
//     pageTitle,
//   );
// });
