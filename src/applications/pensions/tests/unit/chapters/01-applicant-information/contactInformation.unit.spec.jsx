import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import contactInformation from '../../../../config/chapters/01-applicant-information/contactInformation';

const { schema, uiSchema } = contactInformation;

describe('pension contact information page', () => {
  const pageTitle = 'Email address and phone number';
  const expectedNumberOfFields = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 2;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
