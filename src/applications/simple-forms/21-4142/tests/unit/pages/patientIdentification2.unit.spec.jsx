import environment from 'platform/utilities/environment';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.patientIdentificationChapter.pages.patientIdentification2;

const pageTitle = 'patient identification 2';

if (environment.isProduction()) {
  const expectedNumberOfFields = 5;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 3;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
} else {
  const numberOfWebComponentFields = 6;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentFields,
    pageTitle,
  );

  const numberOfWebComponentErrors = 3;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentErrors,
    pageTitle,
  );
}
