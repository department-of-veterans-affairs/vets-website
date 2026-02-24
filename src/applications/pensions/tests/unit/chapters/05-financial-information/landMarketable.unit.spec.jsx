import {
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import landMarketable from '../../../../config/chapters/05-financial-information/landMarketable';

const { schema, uiSchema } = landMarketable;

describe('Pension: Financial information, land marketable page', () => {
  const pageTitle = 'Income and assets';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-alert': 1,
      'va-radio': 1,
    },
    pageTitle,
  );
});
