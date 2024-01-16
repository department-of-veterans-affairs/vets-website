import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import mailingAddress from '../../../../config/chapters/01-applicant-information/mailingAddress';

const { schema, uiSchema } = mailingAddress;

describe('pension mailing address page', () => {
  const pageTitle = 'mailing address';
  const expectedNumberOfFields = 7;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 4;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
