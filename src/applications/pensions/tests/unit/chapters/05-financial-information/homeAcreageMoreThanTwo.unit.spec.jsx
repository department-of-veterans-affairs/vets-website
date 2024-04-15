import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
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

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
