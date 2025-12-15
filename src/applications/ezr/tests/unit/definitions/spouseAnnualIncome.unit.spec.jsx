import formConfig from '../../../config/form';
import { SpouseAnnualIncomePage } from '../../../definitions/spouseAnnualIncome';
import {
  testNumberOfFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from '../config/helpers.spec';

describe('ezr SpouseAnnualIncomePage config', () => {
  const { schema, uiSchema } = SpouseAnnualIncomePage();

  testNumberOfFields(formConfig, schema, uiSchema, 3, 'Spouse Annual Income');

  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    3,
    'Spouse Annual Income',
  );
});
