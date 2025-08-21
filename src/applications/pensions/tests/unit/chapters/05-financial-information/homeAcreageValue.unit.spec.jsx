import {
  testSubmitsWithoutErrors,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import homeAcreageValue from '../../../../config/chapters/05-financial-information/homeAcreageValue';

const { schema, uiSchema } = homeAcreageValue;

describe('financial information home acreage value page', () => {
  const pageTitle = 'home acreage value';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
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
