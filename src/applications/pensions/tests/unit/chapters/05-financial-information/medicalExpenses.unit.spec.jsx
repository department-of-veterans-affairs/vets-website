import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import medicalExpenses from '../../../../config/chapters/05-financial-information/medicalExpenses';

const { schema, uiSchema } = medicalExpenses;

describe('Unreimbursed care expenses pension page', () => {
  const pageTitle = 'Care expenses';
  const expectedNumberOfFields = 1;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  const expectedNumberOfWebComponentFields = 5;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  const expectedNumberOfErrorsForWebComponents = 5;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForWebComponents,
    pageTitle,
  );
});
