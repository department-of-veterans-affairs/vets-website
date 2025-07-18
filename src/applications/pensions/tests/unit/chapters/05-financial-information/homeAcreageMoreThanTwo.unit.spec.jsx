import {
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import homeAcreageMoreThanTwo from '../../../../config/chapters/05-financial-information/homeAcreageMoreThanTwo';

const { schema, uiSchema } = homeAcreageMoreThanTwo;

describe('financial information home acreage pension page', () => {
  const pageTitle = 'home acreage';
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
      'va-radio': 1,
    },
    pageTitle,
  );
});
