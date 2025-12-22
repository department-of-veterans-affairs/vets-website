import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import careExpenses from '../../../../config/chapters/04-household-information/dependentChildren';

import formConfig from '../../../../config/form';

const { schema, uiSchema } = careExpenses;

describe('Add dependent children page', () => {
  const pageTitle = 'Add dependent children';
  const expectedNumberOfFields = 4;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-text-input[label="Child’s first or given name"]`,
      `va-text-input[label="Child’s last or family name"]`,
      `va-memorable-date[label="Date of birth"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 3,
      'va-memorable-date': 1,
    },
    pageTitle,
  );
});
