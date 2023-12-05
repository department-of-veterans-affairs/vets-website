import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from './pageTests.spec';
import formConfig from '../../config/form';
import specialMonthlyPension from '../../pages/specialMonthlyPension';

const { schema, uiSchema } = specialMonthlyPension;

describe('pension special monthly pension page', () => {
  const pageTitle = 'special monthly pension';
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
