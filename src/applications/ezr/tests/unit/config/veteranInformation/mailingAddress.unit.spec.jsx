import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../helpers.spec';
import { expectStateInputToBeRequired } from '../../../helpers';

const {
  chapters: {
    veteranInformation: {
      pages: { mailingAddress },
    },
  },
} = formConfig;
const { title: pageTitle, schema, uiSchema } = mailingAddress;

// run test for correct number of fields on the page
const expectedNumberOfWebComponentFields = 9;
testNumberOfWebComponentFields(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentFields,
  pageTitle,
);

// run test for correct number of error messages on submit
const expectedNumberOfWebComponentErrors = 6;
testNumberOfErrorsOnSubmitForWebComponents(
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfWebComponentErrors,
  pageTitle,
);

describe('ezr VeteranMailingAddress config', () => {
  const { defaultDefinitions: definitions } = formConfig;

  it('if the country selected is not the United States, the state field is still required', async () => {
    expectStateInputToBeRequired(
      schema,
      uiSchema,
      definitions,
      'veteranAddress_country',
      'veteranAddress_state',
    );
  });
});
