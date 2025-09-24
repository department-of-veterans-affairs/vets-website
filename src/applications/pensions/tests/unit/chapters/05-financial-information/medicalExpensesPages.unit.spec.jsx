import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import { medicalExpensesPages } from '../../../../config/chapters/05-financial-information/medicalExpensesPages';

describe('income sources summary page', () => {
  const { summaryPage } = medicalExpensesPages;
  const pageTitle = 'medical expenses summary';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    summaryPage.schema,
    summaryPage.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    summaryPage.schema,
    summaryPage.uiSchema,
    [
      `va-radio[label="Do you, your spouse, or your dependents pay medical or other expenses that aren’t reimbursed?"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    summaryPage.schema,
    summaryPage.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    summaryPage.schema,
    summaryPage.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});
