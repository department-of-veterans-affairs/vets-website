import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import currentSpouseAddress from '../../../../config/chapters/04-household-information/currentSpouseAddress';

describe('current spouse address page', () => {
  const pageTitle = 'current spouse address';
  const expectedNumberOfFields = 6;
  testNumberOfWebComponentFields(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    [
      `va-select[label="Country"]`,
      `va-text-input[label="Street address"]`,
      `va-text-input[label="City"]`,
      `va-text-input[label="Postal code"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    currentSpouseAddress.schema,
    currentSpouseAddress.uiSchema,
    {
      'va-text-input': 5,
      'va-select': 1,
    },
    pageTitle,
  );
});
