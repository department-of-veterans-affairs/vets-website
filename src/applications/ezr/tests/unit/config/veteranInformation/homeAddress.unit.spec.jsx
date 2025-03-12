import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import formConfig from '../../../../config/form';
import { expectStateInputToBeRequired } from '../../../helpers';

const {
  chapters: {
    veteranInformation: {
      pages: { homeAddress },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = homeAddress;

// run test for correct number of fields on the page
const expectedNumberOfWebComponentFields = 8;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 5;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

describe('ezr VeteranHomeAddress config', () => {
  const { defaultDefinitions: definitions } = formConfig;

  it('if the country selected is not the United States, the state field is still required', async () => {
    expectStateInputToBeRequired(
      schema,
      uiSchema,
      definitions,
      'veteranHomeAddress_country',
      'veteranHomeAddress_state',
    );
  });
});
