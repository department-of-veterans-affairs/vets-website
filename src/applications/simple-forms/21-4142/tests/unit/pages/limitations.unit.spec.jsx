import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const { schema, uiSchema } = formConfig.chapters.limitations.pages.limitations;

const pageTitle = 'limitations';

if (environment.isProduction()) {
  const expectedNumberOfFields = 1;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
} else {
  const numberOfWebComponentFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentFields,
    pageTitle,
  );

  const numberOfWebComponentErrors = 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentErrors,
    pageTitle,
  );
}
