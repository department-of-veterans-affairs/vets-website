import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import specialMonthlyPension from '../../../../config/chapters/03-health-and-employment-information/specialMonthlyPension';

const { schema, uiSchema } = specialMonthlyPension;

describe('pension special monthly pension page', () => {
  const pageTitle = 'special monthly pension';
  // Using an old component since the new web component can't take a react
  // object as a title and that's what we need to do in order to get the helper
  // text to be properly read by a screen reader
  const expectedNumberOfFields = 0;
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
