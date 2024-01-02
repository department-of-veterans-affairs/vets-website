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
  const expectedNumberOfFields = 3;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 3;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  const expectedNumberOfWebComponentFields = 3;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  const expectedNumberOfErrorsForWebComponents = 3;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForWebComponents,
    pageTitle,
  );
});
