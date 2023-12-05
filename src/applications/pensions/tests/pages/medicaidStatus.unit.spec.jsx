import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from './pageTests.spec';
import formConfig from '../../config/form';
import medicaidStatus from '../../pages/medicaidStatus';

const { schema, uiSchema } = medicaidStatus;

describe('medicaid status pension page', () => {
  const pageTitle = 'medicaid status';
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
