import formConfig from '../../../config/form';
import { VeteranAnnualIncomePage } from '../../../definitions/veteranAnnualIncome';
import {
  testNumberOfFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from '../config/helpers.spec';

describe('ezr VeteranAnnualIncomePage config', () => {
  const { schema, uiSchema } = VeteranAnnualIncomePage();

  testNumberOfFields(formConfig, schema, uiSchema, 3, 'Veteran Annual Income');

  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    3,
    'Veteran Annual Income',
  );
});
