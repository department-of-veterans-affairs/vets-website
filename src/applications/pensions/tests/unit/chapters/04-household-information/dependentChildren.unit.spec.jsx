import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../pageTests.spec';
import careExpenses from '../../../../config/chapters/04-household-information/dependentChildren';

import formConfig from '../../../../config/form';

const { schema, uiSchema } = careExpenses;

describe('Add dependent children page', () => {
  const pageTitle = 'Add dependent children';
  const expectedNumberOfFields = 7;
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
});
