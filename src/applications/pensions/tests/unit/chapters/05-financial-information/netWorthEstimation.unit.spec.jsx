import {
  testSubmitsWithoutErrors,
  testComponentFieldsMarkedAsRequired,
  testNumberOfWebComponentFields,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import netWorthEstimation from '../../../../config/chapters/05-financial-information/netWorthEstimation';

const { schema, uiSchema } = netWorthEstimation;

describe('Financial information net worth estimation pension page', () => {
  const pageTitle = 'net worth estimation';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [`va-text-input[label="Estimate the total value of your assets"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 1,
    },
    pageTitle,
  );
});
