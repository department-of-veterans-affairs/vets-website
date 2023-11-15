import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import nursingHomeHistory from '../../pages/nursingHomeHistory';

const { schema, uiSchema } = nursingHomeHistory;

describe('pension social security disability page', () => {
  const pageTitle = 'nursing home history';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
