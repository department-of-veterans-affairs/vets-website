import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import { expectStateInputToBeRequired } from '../../../helpers';

const {
  chapters: {
    householdInformation: {
      pages: { spouseContactInformation },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = spouseContactInformation;

// run test for correct number of fields on the page
const expectedNumberOfFields = 8;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfErrors = 5;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
);

describe('ezr VeteranHomeAddress config', () => {
  const { defaultDefinitions: definitions } = formConfig;

  it('if the country selected is not the United States, the state field is still required', async () => {
    expectStateInputToBeRequired(
      schema,
      uiSchema,
      definitions,
      'spouseAddress_country',
      'spouseAddress_state',
    );
  });
});
