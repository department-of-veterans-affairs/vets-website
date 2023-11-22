import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import applicantInformation from '../../pages/applicantInformation';

const { schema, uiSchema } = applicantInformation;

describe('pension applicant information page', () => {
  const pageTitle = 'pension applicant information';
  const expectedNumberOfFields = 9;
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
