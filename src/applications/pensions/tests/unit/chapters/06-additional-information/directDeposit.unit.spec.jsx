import fullSchemaPensions from '../../../../config/form';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
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

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    fullSchemaPensions,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
