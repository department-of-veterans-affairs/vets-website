import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import specialMonthlyPension from '../../../../config/chapters/03-health-and-employment-information/specialMonthlyPension';

const { schema, uiSchema } = specialMonthlyPension;

describe('pension special monthly pension page', () => {
  const pageTitle = 'special monthly pension';
  const expectedNumberOfFields = 2;
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
});
