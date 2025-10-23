import fullSchemaPensions from '../../../../config/form';

import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

describe('Pensions directDeposit', () => {
  const {
    schema,
    uiSchema,
  } = fullSchemaPensions.chapters.additionalInformation.pages.directDeposit;

  const pageTitle = 'Using direct deposit';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    fullSchemaPensions,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    fullSchemaPensions,
    schema,
    uiSchema,
    [`va-radio[label="Do you have a bank account to use for direct deposit?"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(fullSchemaPensions, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    fullSchemaPensions,
    schema,
    uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );
});
