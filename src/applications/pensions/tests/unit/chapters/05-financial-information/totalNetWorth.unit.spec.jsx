import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import totalNetWorth from '../../../../config/chapters/05-financial-information/totalNetWorth';

const { schema, uiSchema } = totalNetWorth;

describe('Financial information total net worth pension page', () => {
  const pageTitle = 'total net worth';
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
