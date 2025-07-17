import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import maritalStatus from '../../../../config/chapters/04-household-information/maritalStatus';

describe('marital status page', () => {
  const pageTitle = 'marital status';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    maritalStatus.schema,
    maritalStatus.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    maritalStatus.schema,
    maritalStatus.uiSchema,
    [`va-radio[label="What’s your current marital status?"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    maritalStatus.schema,
    maritalStatus.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    maritalStatus.schema,
    maritalStatus.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});
