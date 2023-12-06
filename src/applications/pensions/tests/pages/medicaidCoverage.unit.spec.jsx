import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from './pageTests.spec';
import formConfig from '../../config/form';
import medicaidCoverage from '../../pages/medicaidCoverage';

const { schema, uiSchema } = medicaidCoverage;

describe('medicaid coverage pension page', () => {
  const pageTitle = 'medicaid coverage';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
