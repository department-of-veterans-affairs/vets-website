import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import receivesIncome from '../../../../config/chapters/05-financial-information/receivesIncome';

const { schema, uiSchema } = receivesIncome;

describe('Pension: Financial information, receives income page', () => {
  const pageTitle = 'Gross monthly income';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
